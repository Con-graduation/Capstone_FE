export default function AlbumBox({Img, title, artist}) {

    return (
        <div className="w-80 h-20 bg-white flex items-center rounded-[10px] shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)] border border-stone-300">
            <img src={Img} alt="album" className="w-20 h-20 rounded-tl-[10px] rounded-bl-[10px]" />
            <div className="flex flex-col items-start justify-center p-4">
                <p className="text-base font-bold">{title}</p>
                <p className="text-sm font-light">{artist}</p>
            </div>
        </div>
    )
}