import { FormEvent, useEffect, useRef, useState } from "react";
import unsplath from "../apis/unsplash";
import { Photo } from "../types/Types";
// import {Timeout}  from "../types/Types";

export const cache: any = {};

const Home = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [loader, setLoader] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [imageInfo, setImageInfo] = useState<Photo | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const retreivedFromCache = useRef<boolean>(false);

  const fetchPhotos = async () => {
    if (searchTerm === "") return;

    const response = await unsplath.get("/search/photos", {
      params: {
        query: searchTerm,
        per_page: 20,
        page: page,
      },
    });
    setPhotos((prev) => [...prev, ...response.data.results]);

    if (searchTerm in cache) {
      cache[searchTerm] = {
        data: [...cache[searchTerm].data, ...response.data.results],
        page,
      };
    } else {
      cache[searchTerm] = { data: [...response.data.results], page: 1 };
    }
  };

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop + 1 >=
      document.documentElement.scrollHeight
    ) {
      setPage((prev) => prev + 1);
      setLoader(true);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const initialFetch = async () => {
      const response = await unsplath.get("/photos", {
        params: {
          order_by: "popular",
          per_page: 20,
        },
      });
      setPhotos(response.data);
    };

    initialFetch();
  }, []);

  const checkIfInCache = () => {
    if (searchTerm in cache) {
      setPhotos(cache[searchTerm].data);
      setPage(cache[searchTerm].page);
      retreivedFromCache.current = true;
      return true;
    }
    return false;
  };

  useEffect(() => {
    const timeout: NodeJS.Timeout = setTimeout(() => {
      if (!checkIfInCache()) {
        fetchPhotos();
      }
    }, 500);

    return () => {
      clearTimeout(timeout);
    };
  }, [searchTerm]);

  useEffect(() => {
    if (retreivedFromCache.current) {
      retreivedFromCache.current = false;
      return;
    }
    fetchPhotos();
  }, [page]);

  useEffect(() => {
    setLoader(false);
  }, [photos]);

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

  const handleClick = async (id: string) => {
    const response = await unsplath.get(`/photos/${id}`);
    setImageInfo(response.data);
    setShowModal(true);
  };

  return (
    <main className="p-8">
      <form
        className="flex items-center justify-center"
        onSubmit={(event: FormEvent) => {
          event.preventDefault();
        }}
      >
        <input
          type="text"
          placeholder="Search term"
          value={searchTerm}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setSearchTerm(event.target.value);
            setPhotos([]);
          }}
          className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none w-[500px]"
          autoFocus
        />
      </form>

      <section className="grid grid-cols-4 gap-4 mt-8">
        {photos &&
          photos.map((photo) => {
            return (
              <img
                onClick={() => handleClick(photo.id)}
                key={photo.id}
                src={photo.urls.regular}
                alt={photo.alt_description}
                className="rounded-md w-[400px] h-[400px] object-cover cursor-pointer"
              />
            );
          })}
      </section>
      {searchTerm !== ""
        ? loader && (
            <div className="flex justify-center mt-5">
              <div className="newtons-cradle">
                <div className="newtons-cradle__dot"></div>
                <div className="newtons-cradle__dot"></div>
                <div className="newtons-cradle__dot"></div>
                <div className="newtons-cradle__dot"></div>
              </div>
            </div>
          )
        : null}
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
            <div className="flex items-center justify-between">
              <div>
                <span className="font-semibold">DOWNLOADS</span>
                <p>{imageInfo?.downloads}</p>
              </div>
              <div>
                <span className="font-semibold">LIKES</span>
                <p>{imageInfo?.likes}</p>
              </div>
              <div>
                <span className="font-semibold">VIEW</span>
                <p>{imageInfo?.views}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Home;
