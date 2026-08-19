import { useEffect, useRef } from "react";


function InfiniteScroll({
  onLoadMore,
  loading,
  hasMore
}) {
  const observerRef = useRef(null);


  useEffect(() => {
    if (loading || !hasMore) {
      return;
    }


    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onLoadMore();
        }
      },
      {
        threshold: 1
      }
    );


    if (observerRef.current) {
      observer.observe(
        observerRef.current
      );
    }


    return () => observer.disconnect();
  }, [
    loading,
    hasMore,
    onLoadMore
  ]);


  return (
    <div
      ref={observerRef}
      className="scroll-loader"
    >
      {loading && "Loading next 20 records..."}
    </div>
  );
}


export default InfiniteScroll;
