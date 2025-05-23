import { LiaTimesSolid } from "@/assets";
import GenericImage from "../generic-image/generic-image.component";


type ImagesDisplayBoxProps = {
  className?: string;
  images: string[];
  onRemoveImage: (image: string) => void;
};

const ImagesDisplayBox = ({
  className = "",
  images,
  onRemoveImage,
}: ImagesDisplayBoxProps) => {
  

  return (
    <div className={`${className} flex items-start justify-start gap-2`}>
      {!!images.length && images.map((image, index) => (
        <div
          key={index}
          className="relative w-[6rem] aspect-square rounded-sm overflow-hidden border border-dark-variant bg-gray-variant"
        >
          <GenericImage src={image} className="w-full h-full object-contain object-center" alt={`Selected ${index + 1}`} />
          <button
            type="button"
            className="absolute top-1 right-1 w-6 aspect-square rounded-sm p-1 bg-indigo-secondary text-light text-lg flex items-center justify-center cursor-pointer"
            onClick={() => onRemoveImage(image)}
          >
            <LiaTimesSolid />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ImagesDisplayBox;
