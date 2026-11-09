// Layered copies of the original transparent mark give the rotation real depth
// without introducing a canvas, a 3D runtime, or a replacement brand asset.
export default function BrandMark({ className = '' }) {
  return (
    <div aria-hidden="true" className={`brand-mark ${className}`}>
      <div className="brand-orientation">
        <div className="brand-core">
          {Array.from({ length: 8 }, (_, index) => (
            <img key={index} src="/logo_square.png" alt="" width="340" height="340" draggable="false" className="brand-depth" style={{ transform: `translateZ(${-index * 2}px)` }} />
          ))}
          <img src="/logo_square.png" alt="" width="340" height="340" draggable="false" className="brand-face" />
        </div>
      </div>
    </div>
  );
}
