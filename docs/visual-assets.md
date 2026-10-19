# Portfolio character and visual assets

The character is the full-body illustration supplied by the user on the latest
revision, with the white background removed. The original asset preserves its face, hair, outfit, hand-in-pocket pose and
illustrative style. The opening animates the complete illustrated person and
finishes on the original full-body asset; the About sticker uses the same image.

## Asset

- Saved project path: `public/images/sai-illustration.png`.
- Format: 1024 × 1536 RGBA PNG with genuine transparency.
- Source: the user's attached illustration.
- Tool mode: built-in ImageGen **edit**, transparent background extraction.
- No CLI/API image-generation fallback was used.

## Final edit prompt

> Use case: background-extraction. Edit target: the most recently attached full-body
> cartoon illustration of the man in a black blazer, white open-collar shirt, dark
> navy trousers, and white sneakers with hands in his pockets. Primary request:
> remove ONLY the white background and return the same full-body illustration on
> genuine alpha transparency for use in the user's portfolio. Preserve his exact
> face, swept black hair, beard, friendly expression, clothing, hand-in-pocket pose,
> proportions, black outlines, illustrated shading, and both complete shoes. Do not
> redesign or stylize him again. Keep the whole figure including hair and shoes,
> with a small transparent margin around the subject. No floor, no shadow, no extra
> props, no text. The illustration is the edit target, not merely a style reference.

## Current animation

The actor is the user's illustrated person throughout. The current implementation
is a full-body illustrated animation in the live Three.js room, with no stock
human model or separate face overlay. The rejected mechanical body and unrelated
human model have been removed from the active source and project assets.

- `public/images/sai-motion-atlas.png`: matching sixteen-pose transparent atlas.
- `public/images/sai-illustration.png`: original full-body cutout, unchanged; used
  directly for the final standing hands-in-pockets pose.
- `src/scene/illustrationActor.js`: frame sampling, aligned interpolation,
  continuous seated breathing/hand movement, transparent hover testing.
- `src/portfolio/characterSequence.js`: seated → turn → stand → Hello wave → hands
  into trouser pockets → original still. Replay returns to seated.

The atlas was made with the built-in ImageGen edit mode, using the original
illustration as its identity/outfit reference. No CLI/API fallback was used.
See `animation-prompt.md` for the complete prompt. The runtime samples the atlas
without generating replacement files or changing the original still. Pose heads
are aligned during interpolation and the floor baseline remains fixed.

The runtime warps adjacent poses using bidirectional motion vectors before
blending them, avoiding abrupt frame thresholds. `scripts/build-character-motion.py`
calculates these vectors from the existing drawings with OpenCV and NumPy; it
does not change either source PNG. Its outputs are `sai-motion-flow.bin` and
`src/portfolio/characterMotion.json`. Vertical displacement tapers to zero at the
floor while shoes can move horizontally. The actor stays at a fixed scene depth.
The chair advances a short distance into the open floor before the rise, its seated back overlay fades during the
turn. The camera waits until
the character is standing before moving toward the introduction panel.
Once the hips lift, the chair parks to the side of the standing character so
its frame and seat do not overlap his shoes. Replay clears pointer hover and
focuses the scene; desktop Hey appears only after an actual character hover.

The chair has a padded tan back/seat, a central gas lift and five twin-wheel
casters. The upper seat swivels independently of the base; casters steer and
roll as the chair moves. The lower backrest leaves more of the seated legs visible.
In the rear seated view, each leg translates inward without shrinking the calves
or shoes, and moves toward the desk with its floor shadow. Normal depth testing
keeps the caster base in front of the feet. This adjustment eases out during the
turn and leaves the original standing artwork unchanged. The forearms lift as
a whole, preserving their width and length, with a small typing movement. The
shoulders are excluded from this lift to avoid pointed sleeve silhouettes.
The wrists bend inward on the desk side of the torso rather than protruding
outside the elbows. The illustrated mesh writes depth so the back can occlude
the tucked hands in the rear view; the wrist bend releases before standing.

Reference implementation inspection: the public JavaScript at
`https://mildsugardesign.jp/_astro/layout.astro_astro_type_script_index_0_lang.CLEVASSk.js`
plays transparent `typing`, `rhythm`, `stretching`, and `click-pose` video clips
into a canvas. It does not construct a character animation from one still.
No reference character media or code was copied into this project.

Known quality limitation: the sixteen-pose atlas contains much less detail per
pose than the supplied final still, and adjacent drawings differ. Motion-vector
interpolation cannot recover missing illustration detail or fully prevent
double contours. The runtime now computes correspondence on a vertex grid to
reduce rendering cost, but reference-quality consistency still requires a
continuous rendered character clip or an articulated character asset.

Reduced motion skips directly through transitions to the original pocket pose.
The original illustration also remains in the About sticker and WebGL fallback.
The room, chair, plants and other section symbols remain live 3D geometry.
