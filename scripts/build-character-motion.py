"""Build motion-vector data from the existing, unchanged illustration files.

Run with OpenCV and NumPy installed. Outputs binary displacement vectors and
sampling metadata only; neither source PNG is modified or re-encoded.
"""
from pathlib import Path
import json
import cv2
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
ATLAS = cv2.imread(str(ROOT / 'public/images/sai-motion-atlas.png'), cv2.IMREAD_UNCHANGED)
STILL = cv2.imread(str(ROOT / 'public/images/sai-illustration.png'), cv2.IMREAD_UNCHANGED)
HEIGHT = 4.0
PLANE_HEIGHT = 4.18
HEAD_HEIGHT = .78
FLOW_WIDTH, FLOW_HEIGHT = 128, 224
PADDING, COLUMNS = 2, 4
PAIRS = [(0,2),(2,3),(3,4),(4,5),(5,6),(6,7),(7,8),(8,9),
         (9,10),(10,11),(10,12),(12,13),(13,14),(14,15),(15,-1)]


def bounds(image, region):
    left, top, right, bottom = region
    left, right = int(np.floor(left)), int(np.ceil(right))
    top, bottom = int(np.floor(top)), int(np.ceil(bottom))
    ys, xs = np.nonzero(image[top:bottom, left:right, 3] >= 180)
    if not len(xs):
        raise ValueError(f'Empty animation region: {region}')
    return dict(left=int(xs.min()+left), right=int(xs.max()+left+1),
                top=int(ys.min()+top), bottom=int(ys.max()+top+1))


rows = np.array([0, 333, 674, 1096, 1536]) * ATLAS.shape[0] / 1536
column_width = ATLAS.shape[1] / 4
frames = []
for index in range(16):
    row, column = divmod(index, 4)
    region = [column*column_width, rows[row], (column+1)*column_width, rows[row+1]]
    box = bounds(ATLAS, region)
    h = box['bottom'] - box['top']
    head = bounds(ATLAS, [region[0], box['top'], region[2], box['top']+h*.2])
    frames.append(dict(center=(head['left']+head['right'])/2,
                       foot=box['bottom'], top=float(rows[row]),
                       bottom=float(rows[row+1]), height=h))
original = bounds(STILL, [0,0,STILL.shape[1],STILL.shape[0]])
original_height = original['bottom'] - original['top']
head = bounds(STILL, [0,original['top'],STILL.shape[1],original['top']+original_height*.2])
original.update(center=(head['left']+head['right'])/2, scale=original_height/HEIGHT)
ppu = frames[15]['height'] / HEIGHT
plane_width = column_width / ppu
x = ((np.arange(FLOW_WIDTH, dtype=np.float32)+.5)/FLOW_WIDTH-.5)*plane_width
y = (1-(np.arange(FLOW_HEIGHT, dtype=np.float32)+.5)/FLOW_HEIGHT)*PLANE_HEIGHT
xx, yy = np.meshgrid(x,y)


def guide(index):
    if index == -1:
        image, center, foot, scale, frame_height = STILL, original['center'], original['bottom'], original['scale'], HEIGHT
        top, bottom = 0, STILL.shape[0]
    else:
        frame = frames[index]
        image, center, foot, scale, frame_height = ATLAS, frame['center'], frame['foot'], ppu, frame['height']/ppu
        top, bottom = frame['top'], frame['bottom']
    source_y = np.where(yy > HEIGHT-HEAD_HEIGHT,
                        yy+frame_height-HEIGHT,
                        yy*(frame_height-HEAD_HEIGHT)/(HEIGHT-HEAD_HEIGHT))
    px, py = center+xx*scale, foot-source_y*scale
    rgba = cv2.remap(image, (px-.5).astype(np.float32), (py-.5).astype(np.float32),
                     cv2.INTER_LINEAR, borderMode=cv2.BORDER_CONSTANT)
    rgba[(py<top)|(py>=bottom)] = 0
    alpha = rgba[:,:,3].astype(np.float32)/255
    gray = cv2.cvtColor(rgba[:,:,:3],cv2.COLOR_BGR2GRAY).astype(np.float32)
    # Both the silhouette and internal drawing features guide correspondence.
    return np.ascontiguousarray(np.clip((gray*.6+102)*alpha,0,255).astype(np.uint8))


guides = {index:guide(index) for index in [-1,*range(16)]}
algorithm = cv2.DISOpticalFlow_create(cv2.DISOPTICAL_FLOW_PRESET_MEDIUM)
algorithm.setFinestScale(0)
algorithm.setVariationalRefinementIterations(15)
algorithm.setUseSpatialPropagation(True)
tile_width, tile_height = FLOW_WIDTH+PADDING*2, FLOW_HEIGHT+PADDING*2
row_count = (len(PAIRS)+COLUMNS-1)//COLUMNS
vectors = np.zeros((row_count*tile_height,COLUMNS*tile_width,4),dtype=np.float16)
entries = []
for index,(start,end) in enumerate(PAIRS):
    forward = algorithm.calc(guides[start],guides[end],None)
    backward = algorithm.calc(guides[end],guides[start],None)
    field = np.concatenate([forward,backward],axis=2)
    field = cv2.GaussianBlur(field,(3,3),.55)
    field[:,:,[0,2]] = np.clip(field[:,:,[0,2]],-64,64)/FLOW_WIDTH
    field[:,:,[1,3]] = -np.clip(field[:,:,[1,3]],-100,100)/FLOW_HEIGHT
    # The floor never moves, even when the upper figure leans and rises.
    ground_weight = np.clip((1-(np.arange(FLOW_HEIGHT)+.5)/FLOW_HEIGHT-.015)/.06,0,1)
    field[:,:,[1,3]] *= ground_weight[:,None,None]
    field = np.flipud(field).astype(np.float16)
    tile = np.pad(field,((PADDING,PADDING),(PADDING,PADDING),(0,0)),mode='edge')
    row,column = divmod(index,COLUMNS)
    vectors[row*tile_height:(row+1)*tile_height,column*tile_width:(column+1)*tile_width] = tile
    entries.append(dict(start=start,end=end,index=index))
    print(f'motion {start:2d} -> {end:2d}', flush=True)

metadata = dict(version=1, width=vectors.shape[1],height=vectors.shape[0],
                frameWidth=FLOW_WIDTH,frameHeight=FLOW_HEIGHT,
                tileWidth=tile_width,tileHeight=tile_height,padding=PADDING,columns=COLUMNS,
                planeWidth=plane_width,planeHeight=PLANE_HEIGHT,standingHeight=HEIGHT,
                headHeight=HEAD_HEIGHT,pixelsPerUnit=ppu,frames=frames,
                original=original,pairs=entries)
(ROOT/'public/images/sai-motion-flow.bin').write_bytes(vectors.astype('<f2').tobytes())
(ROOT/'src/portfolio/characterMotion.json').write_text(json.dumps(metadata,indent=2)+'\n')
print(f'Saved {vectors.nbytes:,} bytes of motion vectors. Source PNGs unchanged.')
