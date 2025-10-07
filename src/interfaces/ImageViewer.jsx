const ImageViewer = ({ imageViewer, closeImageViewer, navigateImage }) => (
  <div className="image-viewer">
    <button className="viewer-close" onClick={closeImageViewer}>✖</button>

    <button className="viewer-nav prev" onClick={() => navigateImage(-1)}>◀</button>

    <div className="viewer-image-container">
      <img
        src={imageViewer.images[imageViewer.index]}
        alt="Imagen ampliada"
        className="viewer-image"
      />
      <div className="viewer-counter">
        {imageViewer.index + 1} / {imageViewer.images.length}
      </div>
    </div>

    <button className="viewer-nav next" onClick={() => navigateImage(1)}>▶</button>
  </div>
);
//s
export default ImageViewer;
