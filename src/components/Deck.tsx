//import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";
import { convertFileSrc } from '@tauri-apps/api/core';

function hexToRgb(hex:any) {
  const h = hex.replace("#", "");
  if (h.length === 3) {
    return {
      r: parseInt(h[0] + h[0], 16),
      g: parseInt(h[1] + h[1], 16),
      b: parseInt(h[2] + h[2], 16),
    };
  }
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

function hexToRgba(hex:any, alpha:any = 1) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default function Deck({page, setPage, folder, setFolder, data, audios, setAudios, setDropMenuShow, setDropMenuCord, setDropMenuType, setButtonToEdit, setHoveredButton, modalShow}:any) {
    // VARIABLE
    const [style, setStyle] = useState<string[]>(["#BAC2DE","#BAC2DE","#BAC2DE","#BAC2DE","#BAC2DE","#BAC2DE","#BAC2DE","#BAC2DE","#BAC2DE","#BAC2DE","#BAC2DE","#BAC2DE","#BAC2DE","#BAC2DE","#BAC2DE"]);
    const [img, setImg] = useState<any[]>([undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined]);

    // FUNCTION
    const handleButton = (e:any) => {
        setHoveredButton("");
        if(e.target.id.toString() == "btn-nextPage") {
            setPage(page + 1);
        } else if(e.target.id.toString() == "btn-prevPage") {
            if(page > 0) { setPage(page - 1); }
        } else if(e.target.id.toString() == "btn-prevFolder") {
            if(folder !== "root") {
                setFolder(data.filter((button:any) => button["name"] == folder)[0]["parent"]);
                setPage(0);
            }
        } else {
            const button = data.filter((button:any) => button["parent"] == folder).filter((button:any) => button["pos"] == parseInt(e.target.id.toString().replace("btn-",""))).filter((button:any) => button["page"] == page);
            setButtonToEdit(parseInt(e.target.id.toString().replace("btn-","")));
            if(button.length > 0) {
                if(button[0]["type"] == "folder") {
                    setFolder(button[0]["name"]);
                    setPage(0);
                } else if(button[0]["type"] == "sound") {
                    let audio = new Audio(new URL(convertFileSrc(button[0]["sound"]), import.meta.url).href);
                    audio.id = `${button[0]["parent"]}-${button[0]["page"]}-${button[0]["pos"]}`;
                    audio.volume = button[0]["volume"] / 100;
                    audio.loop = button[0]["loop"];
                    audio.play();
                    setAudios([...audios, audio]);
                }
            } else {
                setDropMenuType("new");
                setDropMenuShow(true);
                var dropMenuX = e.pageX;
                var dropMenuY = e.pageY;
                if(e.pageX >= 400) { dropMenuX = dropMenuX - 105 }
                if(e.pageY >= 250) { dropMenuY = dropMenuY - 70 }
                setDropMenuCord([dropMenuY, dropMenuX]);
            }
        }
    };

    const handleRightClick = (e:any) => {
        const button = data.filter((button:any) => button["parent"] == folder).filter((button:any) => button["pos"] == parseInt(e.target.id.toString().replace("btn-",""))).filter((button:any) => button["page"] == page);
        setButtonToEdit(parseInt(e.target.id.toString().replace("btn-","")));
        if(button.length > 0) {
            if(button[0]["type"] == "folder") {
                setDropMenuType("editFolder");
                setDropMenuShow(true);
                var dropMenuX = e.pageX;
                var dropMenuY = e.pageY;
                if(e.pageX >= 400) { dropMenuX = dropMenuX - 105 }
                if(e.pageY >= 250) { dropMenuY = dropMenuY - 70 }
                setDropMenuCord([dropMenuY, dropMenuX]);
            } else if(button[0]["type"] == "sound") {
                setDropMenuType("editSound");
                setDropMenuShow(true);
                var dropMenuX = e.pageX;
                var dropMenuY = e.pageY;
                if(e.pageX >= 400) { dropMenuX = dropMenuX - 105 }
                if(e.pageY >= 180) { dropMenuY = dropMenuY - 140 }
                setDropMenuCord([dropMenuY, dropMenuX]);
            }
        }
    };

    const handleHover = (e:any) => {
        if(e.target.id == "btn-nextPage") {
            setHoveredButton("Next page");
        } else if(e.target.id == "btn-prevPage") {
            setHoveredButton("Previous page");
        } else if(e.target.id == "btn-prevFolder") {
            setHoveredButton("Previous folder");
        }
        const button = data.filter((button:any) => button["parent"] == folder).filter((button:any) => button["pos"] == parseInt(e.target.id.toString().replace("btn-",""))).filter((button:any) => button["page"] == page);
        if(button.length > 0) {
            setHoveredButton(button[0]["name"]);
        }
    }
    
    useEffect(() => {
        if(data !== null) {
            setStyle(["#BAC2DE","#BAC2DE","#BAC2DE","#BAC2DE","#BAC2DE","#BAC2DE","#BAC2DE","#BAC2DE","#BAC2DE","#BAC2DE","#BAC2DE","#BAC2DE","#BAC2DE","#BAC2DE","#BAC2DE"]);
            setImg([undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined]);
            data.filter((button:any) => button["parent"] == folder).filter((button:any) => button["page"] == page).forEach((button:any) => {
                setStyle(values => values.map((value, i) => i === button["pos"]-1 ? button["color"]: value));
                if(button["img"] !== null && button["img"] !== "") {
                    setImg(values => values.map((value, i) => i === button["pos"]-1 ? convertFileSrc(button["img"]): value));
                } else {
                    if(button["type"] == "folder") {
                        setImg(values => values.map((value, i) => i === button["pos"]-1 ? document.querySelector("#hidden-folder")?.getAttribute("src") ?? undefined: value));
                    } else if(button["type"] == "sound") {
                        setImg(values => values.map((value, i) => i === button["pos"]-1 ? document.querySelector("#hidden-sound")?.getAttribute("src") ?? undefined: value));
                    }
                }
            });
        }
    }, [page, data, folder, modalShow]);

    // RENDER
    return (
        <div className="w-full h-full flex flex-wrap gap-[25.6px] gap-y-[25.6px]">
            <button onMouseMove={(e) => handleHover(e)} onMouseLeave={() => setHoveredButton("")} onContextMenu={(e) => handleRightClick(e)} onClick={(e) => handleButton(e)} id="btn-1" style={{backgroundColor: hexToRgba(style[0], 0.08), borderColor: hexToRgba(style[0], 0.4)}} className={"w-[63px] h-[63px] flex justify-center items-center cursor-pointer border-[2px] rounded-[12px] shadow-[inset_0px_0px_14px_10px_rgba(186,194,222,_0.05)] p-[10px]"}><img className="w-full" id="btn-1" src={img[0]}/></button>
            <button onMouseMove={(e) => handleHover(e)} onMouseLeave={() => setHoveredButton("")} onContextMenu={(e) => handleRightClick(e)} onClick={(e) => handleButton(e)} id="btn-2" style={{backgroundColor: hexToRgba(style[1], 0.08), borderColor: hexToRgba(style[1], 0.4)}} className={"w-[63px] h-[63px] flex justify-center items-center cursor-pointer border-[2px] rounded-[12px] shadow-[inset_0px_0px_14px_10px_rgba(186,194,222,_0.05)] p-[10px]"}><img className="w-full" id="btn-2" src={img[1]}/></button>
            <button onMouseMove={(e) => handleHover(e)} onMouseLeave={() => setHoveredButton("")} onContextMenu={(e) => handleRightClick(e)} onClick={(e) => handleButton(e)} id="btn-3" style={{backgroundColor: hexToRgba(style[2], 0.08), borderColor: hexToRgba(style[2], 0.4)}} className={"w-[63px] h-[63px] flex justify-center items-center cursor-pointer border-[2px] rounded-[12px] shadow-[inset_0px_0px_14px_10px_rgba(186,194,222,_0.05)] p-[10px]"}><img className="w-full" id="btn-3" src={img[2]}/></button>
            <button onMouseMove={(e) => handleHover(e)} onMouseLeave={() => setHoveredButton("")} onContextMenu={(e) => handleRightClick(e)} onClick={(e) => handleButton(e)} id="btn-4" style={{backgroundColor: hexToRgba(style[3], 0.08), borderColor: hexToRgba(style[3], 0.4)}} className={"w-[63px] h-[63px] flex justify-center items-center cursor-pointer border-[2px] rounded-[12px] shadow-[inset_0px_0px_14px_10px_rgba(186,194,222,_0.05)] p-[10px]"}><img className="w-full" id="btn-4" src={img[3]}/></button>
            <button onMouseMove={(e) => handleHover(e)} onMouseLeave={() => setHoveredButton("")} onContextMenu={(e) => handleRightClick(e)} onClick={(e) => handleButton(e)} id="btn-5" style={{backgroundColor: hexToRgba(style[4], 0.08), borderColor: hexToRgba(style[4], 0.4)}} className={"w-[63px] h-[63px] flex justify-center items-center cursor-pointer border-[2px] rounded-[12px] shadow-[inset_0px_0px_14px_10px_rgba(186,194,222,_0.05)] p-[10px]"}><img className="w-full" id="btn-5" src={img[4]}/></button>
            <button onMouseMove={(e) => handleHover(e)} onMouseLeave={() => setHoveredButton("")} onClick={(e) => handleButton(e)} id="btn-nextPage" className="w-[63px] h-[63px] flex justify-center items-center cursor-pointer bg-[#89B4FA]/8 border-[2px] border-[#89B4FA]/40 rounded-[12px] shadow-[inset_0px_0px_14px_10px_rgba(256,256,256,_0.05)]"><img id="btn-nextPage" src={document.querySelector("#hidden-right-arrow")?.getAttribute("src") ?? undefined}/></button>
            <button onMouseMove={(e) => handleHover(e)} onMouseLeave={() => setHoveredButton("")} onContextMenu={(e) => handleRightClick(e)} onClick={(e) => handleButton(e)} id="btn-6" style={{backgroundColor: hexToRgba(style[5], 0.08), borderColor: hexToRgba(style[5], 0.4)}} className={"w-[63px] h-[63px] flex justify-center items-center cursor-pointer border-[2px] rounded-[12px] shadow-[inset_0px_0px_14px_10px_rgba(186,194,222,_0.05)] p-[10px]"}><img className="w-full" id="btn-6" src={img[5]}/></button>
            <button onMouseMove={(e) => handleHover(e)} onMouseLeave={() => setHoveredButton("")} onContextMenu={(e) => handleRightClick(e)} onClick={(e) => handleButton(e)} id="btn-7" style={{backgroundColor: hexToRgba(style[6], 0.08), borderColor: hexToRgba(style[6], 0.4)}} className={"w-[63px] h-[63px] flex justify-center items-center cursor-pointer border-[2px] rounded-[12px] shadow-[inset_0px_0px_14px_10px_rgba(186,194,222,_0.05)] p-[10px]"}><img className="w-full" id="btn-7" src={img[6]}/></button>
            <button onMouseMove={(e) => handleHover(e)} onMouseLeave={() => setHoveredButton("")} onContextMenu={(e) => handleRightClick(e)} onClick={(e) => handleButton(e)} id="btn-8" style={{backgroundColor: hexToRgba(style[7], 0.08), borderColor: hexToRgba(style[7], 0.4)}} className={"w-[63px] h-[63px] flex justify-center items-center cursor-pointer border-[2px] rounded-[12px] shadow-[inset_0px_0px_14px_10px_rgba(186,194,222,_0.05)] p-[10px]"}><img className="w-full" id="btn-8" src={img[7]}/></button>
            <button onMouseMove={(e) => handleHover(e)} onMouseLeave={() => setHoveredButton("")} onContextMenu={(e) => handleRightClick(e)} onClick={(e) => handleButton(e)} id="btn-9" style={{backgroundColor: hexToRgba(style[8], 0.08), borderColor: hexToRgba(style[8], 0.4)}} className={"w-[63px] h-[63px] flex justify-center items-center cursor-pointer border-[2px] rounded-[12px] shadow-[inset_0px_0px_14px_10px_rgba(186,194,222,_0.05)] p-[10px]"}><img className="w-full" id="btn-9" src={img[8]}/></button>
            <button onMouseMove={(e) => handleHover(e)} onMouseLeave={() => setHoveredButton("")} onContextMenu={(e) => handleRightClick(e)} onClick={(e) => handleButton(e)} id="btn-10" style={{backgroundColor: hexToRgba(style[9], 0.08), borderColor: hexToRgba(style[9], 0.4)}} className={"w-[63px] h-[63px] flex justify-center items-center cursor-pointer border-[2px] rounded-[12px] shadow-[inset_0px_0px_14px_10px_rgba(186,194,222,_0.05)] p-[10px]"}><img className="w-full" id="btn-10" src={img[9]}/></button>
            <button onMouseMove={(e) => handleHover(e)} onMouseLeave={() => setHoveredButton("")} onClick={(e) => handleButton(e)} id="btn-prevPage" className="w-[63px] h-[63px] flex justify-center items-center cursor-pointer bg-[#89B4FA]/8 border-[2px] border-[#89B4FA]/40 rounded-[12px] shadow-[inset_0px_0px_14px_10px_rgba(256,256,256,_0.05)]"><img id="btn-prevPage" src={document.querySelector("#hidden-left-arrow")?.getAttribute("src") ?? undefined}/></button>
            <button onMouseMove={(e) => handleHover(e)} onMouseLeave={() => setHoveredButton("")} onContextMenu={(e) => handleRightClick(e)} onClick={(e) => handleButton(e)} id="btn-11" style={{backgroundColor: hexToRgba(style[10], 0.08), borderColor: hexToRgba(style[10], 0.4)}} className={"w-[63px] h-[63px] flex justify-center items-center cursor-pointer border-[2px] rounded-[12px] shadow-[inset_0px_0px_14px_10px_rgba(186,194,222,_0.05)] p-[10px]"}><img className="w-full" id="btn-11" src={img[10]}/></button>
            <button onMouseMove={(e) => handleHover(e)} onMouseLeave={() => setHoveredButton("")} onContextMenu={(e) => handleRightClick(e)} onClick={(e) => handleButton(e)} id="btn-12" style={{backgroundColor: hexToRgba(style[11], 0.08), borderColor: hexToRgba(style[11], 0.4)}} className={"w-[63px] h-[63px] flex justify-center items-center cursor-pointer border-[2px] rounded-[12px] shadow-[inset_0px_0px_14px_10px_rgba(186,194,222,_0.05)] p-[10px]"}><img className="w-full" id="btn-12" src={img[11]}/></button>
            <button onMouseMove={(e) => handleHover(e)} onMouseLeave={() => setHoveredButton("")} onContextMenu={(e) => handleRightClick(e)} onClick={(e) => handleButton(e)} id="btn-13" style={{backgroundColor: hexToRgba(style[12], 0.08), borderColor: hexToRgba(style[12], 0.4)}} className={"w-[63px] h-[63px] flex justify-center items-center cursor-pointer border-[2px] rounded-[12px] shadow-[inset_0px_0px_14px_10px_rgba(186,194,222,_0.05)] p-[10px]"}><img className="w-full" id="btn-13" src={img[12]}/></button>
            <button onMouseMove={(e) => handleHover(e)} onMouseLeave={() => setHoveredButton("")} onContextMenu={(e) => handleRightClick(e)} onClick={(e) => handleButton(e)} id="btn-14" style={{backgroundColor: hexToRgba(style[13], 0.08), borderColor: hexToRgba(style[13], 0.4)}} className={"w-[63px] h-[63px] flex justify-center items-center cursor-pointer border-[2px] rounded-[12px] shadow-[inset_0px_0px_14px_10px_rgba(186,194,222,_0.05)] p-[10px]"}><img className="w-full" id="btn-14" src={img[13]}/></button>
            <button onMouseMove={(e) => handleHover(e)} onMouseLeave={() => setHoveredButton("")} onContextMenu={(e) => handleRightClick(e)} onClick={(e) => handleButton(e)} id="btn-15" style={{backgroundColor: hexToRgba(style[14], 0.08), borderColor: hexToRgba(style[14], 0.4)}} className={"w-[63px] h-[63px] flex justify-center items-center cursor-pointer border-[2px] rounded-[12px] shadow-[inset_0px_0px_14px_10px_rgba(186,194,222,_0.05)] p-[10px]"}><img className="w-full" id="btn-15" src={img[14]}/></button>
            <button onMouseMove={(e) => handleHover(e)} onMouseLeave={() => setHoveredButton("")} onClick={(e) => handleButton(e)} id="btn-prevFolder" className="w-[63px] h-[63px] flex justify-center items-center cursor-pointer bg-[#D20F39]/8 border-[2px] border-[#D20F39]/40 rounded-[12px] shadow-[inset_0px_0px_14px_10px_rgba(256,256,256,_0.05)]"><img id="btn-prevFolder" src={document.querySelector("#hidden-left-arrow")?.getAttribute("src") ?? undefined}/></button>
        </div>
    );
}