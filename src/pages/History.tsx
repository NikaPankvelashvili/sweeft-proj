import { cache } from "./Home";
import { useState, useRef, useEffect } from "react";
import unsplath from "../apis/unsplash";
import { Photo } from "../types/Types";

const History = () => {
  const [selected, setSelected] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [imageInfo, setImageInfo] = useState<Photo | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const handleClick = async (id: string) => {
    const response = await unsplath.get(`/photos/${id}`);
    setImageInfo(response.data);
    setShowModal(true);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setShowModal(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <main className="flex justify-between">
      <ul className="w-[20%] min-h-screen bg-[#B784B7] p-4">
        <span>SEARCHE HISTORY:</span>
        {Object.keys(cache).map((item) => {
          return (
            <li
              className=" cursor-pointer"
              key={item}
              onClick={() => setSelected(item)}
            >
              {item}
            </li>
          );
        })}
      </ul>
      <div className="w-[80%]">
        {selected && (
          <div className="flex justify-center w-[100%]">
            <div className="grid grid-cols-3 gap-5 w-[80%]  mt-5">
              {cache[selected].data.map((photo: any) => {
                return (
                  <img
                    onClick={() => {
                      handleClick(photo.id);
                    }}
                    key={photo.id}
                    src={photo.urls.regular}
                    alt={photo.alt_description}
                    className="rounded-md w-[100%] h-[300px] object-cover  cursor-pointer"
                  />
                );
              })}
            </div>
          </div>
        )}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div
              ref={modalRef}
              className="bg-white rounded-md p-8 overflow-hidden"
            >
              <div className="flex justify-end">
                <span
                  onClick={() => setShowModal(false)}
                  className="flex justify-end font-bold cursor-pointer w-1 mb-2"
                >
                  X
                </span>
              </div>
              <img
                src={imageInfo?.urls.regular}
                alt={imageInfo?.alt_description}
                className="object-cover w-[500px] h-[500px] rounded-md mb-8"
              />
              <div className="flex items-center justify-between  w-full">
                <div className=" ">
                  <span className="font-semibold">DOWNLOADS</span>
                  <p>{imageInfo?.downloads}</p>
                </div>
                <div className=" ">
                  <span className=" font-semibold">LIKES</span>
                  <p>{imageInfo?.likes}</p>
                </div>
                <div className=" ">
                  <span className=" font-semibold">VIEW</span>
                  <p>{imageInfo?.views}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default History;
