export default function AlbumBox() {
    return (
        <div className="w-80 h-20 bg-white flex items-center justify-center rounded-[10px] shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)] border border-stone-300">
            {/* <img src={album} alt="album" className="w-16 h-16" /> */}
            <div className="flex flex-col items-start justify-center p-4">
                <p className="text-sm font-bold">Album Title</p>
                <p className="text-sm font-light">Artist Name</p>
            </div>
        </div>
    )
}