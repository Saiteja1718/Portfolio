export const CHARACTER_IMAGE = `${import.meta.env.BASE_URL}images/sai-illustration.png`;

export default function CharacterArt({ className = '' }) {
  return <div className={`character-art ${className}`} aria-hidden="true"><span className="character-art-halo" /><img src={CHARACTER_IMAGE} alt="" loading="lazy" decoding="async" /></div>;
}
