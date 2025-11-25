import { useEffect, useState } from "react";
import { open } from '@tauri-apps/plugin-dialog';
import { convertFileSrc } from '@tauri-apps/api/core';
import { BaseDirectory, writeTextFile } from '@tauri-apps/plugin-fs';

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

export default function Modal({data, setData, settings, setSettings, show, setShow, type, setType, parent, page, buttonToEdit, setWarningShow, setWarningType}:any) {
    // VARIABLE
    const [nameInput, setNameInput] = useState<string>("");
    const [imageInput, setImageInput] = useState<string>("");
    const [soundInput, setSoundInput] = useState<string>("");
    const [buttonColor, setButtonColor] = useState<string>("BAC2DE");
    const [loop, setLoop] = useState<boolean>(false);

    const [displayButton, setDisplayButton] = useState<boolean>(false);
    //const [globalVolumeInput, setGlobalVolumeInput] = useState<number>(50);

    // FUNCTION
    const handleClose = async () => {
        setShow(false);
    };

    const handleSubmit = async () => {
        if(type == "addSound") {
            if(nameInput !== "" && soundInput !== "") {
                setData([...data, {"name":nameInput,"pos":buttonToEdit,"page":page,"color":`#${buttonColor.replace("#", "")}`,"parent":parent,"type":"sound","img":imageInput,"sound":soundInput,"volume":"50","loop":loop}]);
                await writeTextFile('deckData.json', JSON.stringify([...data, {"name":nameInput,"pos":buttonToEdit,"page":page,"color":`#${buttonColor.replace("#", "")}`,"parent":parent,"type":"sound","img":imageInput,"sound":soundInput,"volume":"50","loop":loop}]), { baseDir: BaseDirectory.AppConfig });
                setShow(false);
            }
        } else if(type == "addFolder") {
            if(nameInput !== "") {
                if(data.filter((button:any) => button["type"] == "folder").filter((button:any) => button["name"].toLowerCase() == nameInput.toLowerCase()).length < 1 && nameInput !== "root") {
                    setData([...data, {"name":nameInput,"pos":buttonToEdit,"page":page,"color":`#${buttonColor.replace("#", "")}`,"parent":parent,"type":"folder","img":imageInput}]);
                    await writeTextFile('deckData.json', JSON.stringify([...data, {"name":nameInput,"pos":buttonToEdit,"page":page,"color":`#${buttonColor.replace("#", "")}`,"parent":parent,"type":"folder","img":imageInput}]), { baseDir: BaseDirectory.AppConfig });
                    setShow(false);
                } else {
                    setWarningType("folderNameExist");
                    setWarningShow(true);
                }
            }
        }
    };

    const handleEdit = async () => {
        if(type == "editSound") {
            if(nameInput !== "" && soundInput !== "") {
                data.filter((button:any) => button["parent"] == parent).filter((button:any) => button["pos"] == buttonToEdit).filter((button:any) => button["page"] == page)[0]["name"] = nameInput;
                data.filter((button:any) => button["parent"] == parent).filter((button:any) => button["pos"] == buttonToEdit).filter((button:any) => button["page"] == page)[0]["img"] = imageInput;
                data.filter((button:any) => button["parent"] == parent).filter((button:any) => button["pos"] == buttonToEdit).filter((button:any) => button["page"] == page)[0]["sound"] = soundInput;
                data.filter((button:any) => button["parent"] == parent).filter((button:any) => button["pos"] == buttonToEdit).filter((button:any) => button["page"] == page)[0]["color"] = buttonColor;
                data.filter((button:any) => button["parent"] == parent).filter((button:any) => button["pos"] == buttonToEdit).filter((button:any) => button["page"] == page)[0]["loop"] = loop;
                setData(data);
                await writeTextFile('deckData.json', JSON.stringify(data), { baseDir: BaseDirectory.AppConfig });
                setShow(false);
            }
        } else if(type == "editFolder") {
            if(nameInput !== "") {
                if(data.filter((button:any) => button["type"] == "folder").filter((button:any) => button["name"].toLowerCase() == nameInput.toLowerCase()).length < 1 && nameInput !== "root") {
                    const editingButton = data.filter((button:any) => button["parent"] == parent).filter((button:any) => button["pos"] == buttonToEdit).filter((button:any) => button["page"] == page)[0];
                    data.filter((button:any) => button["parent"] == editingButton["name"]).forEach((button:any) => {
                        button["parent"] = nameInput;
                    });
                    data.filter((button:any) => button["parent"] == parent).filter((button:any) => button["pos"] == buttonToEdit).filter((button:any) => button["page"] == page)[0]["name"] = nameInput;
                    data.filter((button:any) => button["parent"] == parent).filter((button:any) => button["pos"] == buttonToEdit).filter((button:any) => button["page"] == page)[0]["img"] = imageInput;
                    data.filter((button:any) => button["parent"] == parent).filter((button:any) => button["pos"] == buttonToEdit).filter((button:any) => button["page"] == page)[0]["color"] = buttonColor;
                    setData(data);
                    await writeTextFile('deckData.json', JSON.stringify(data), { baseDir: BaseDirectory.AppConfig });
                    setShow(false);
                } else {
                    setWarningType("folderNameExist");
                    setWarningShow(true);
                }
            }
        }
    };

    const handleImageInput = async () => {
        const file = await open({
            multiple: false,
            directory: false,
            filters: [{
                name: 'Image',
                extensions: ['png', 'jpeg', 'jpg', 'gif']
            }]
        });
        setImageInput(file!.toString());
    };

    const handleSoundInput = async () => {
        const file = await open({
            multiple: false,
            directory: false,
            filters: [{
                name: 'Audio',
                extensions: ['mp3', 'wav']
            }]
        });
        setSoundInput(file!.toString());
    };

    const handleSetSettings = async (type:string) => {
        if(type == "displayHoverName") {
            setDisplayButton(!settings["displayHoverName"]);
            settings["displayHoverName"] = !settings["displayHoverName"];
            setSettings(settings);
            await writeTextFile('settings.json', JSON.stringify(settings), { baseDir: BaseDirectory.AppConfig });
        }
    };

    /*
    const handleVolumeChange = async (value:any) => {
        setGlobalVolumeInput(value.target.value);
    };

    const handleVolumeMouseUp = async () => {
        settings["globalVolume"] = globalVolumeInput;
        await writeTextFile('settings.json', JSON.stringify(settings), { baseDir: BaseDirectory.AppConfig });
        setSettings(settings);
    };
    */

    useEffect(() => {
        setNameInput("");
        setImageInput("");
        setSoundInput("");
        setButtonColor("BAC2DE");
        setLoop(false);
        if(type == "editSound") {
            const editingButton = data.filter((button:any) => button["parent"] == parent).filter((button:any) => button["pos"] == buttonToEdit).filter((button:any) => button["page"] == page)[0];
            setNameInput(editingButton["name"]);
            setImageInput(editingButton["img"]);
            setSoundInput(editingButton["sound"]);
            setButtonColor(editingButton["color"].replace("#", ""));
            setLoop(editingButton["loop"]);
        } else if(type == "editFolder") {
            const editingButton = data.filter((button:any) => button["parent"] == parent).filter((button:any) => button["pos"] == buttonToEdit).filter((button:any) => button["page"] == page)[0];
            setNameInput(editingButton["name"]);
            setImageInput(editingButton["img"]);
            setButtonColor(editingButton["color"].replace("#", ""));
        }
    }, [show]);

    useEffect(() => {
        if(type == "settingsAudio") {
            //setGlobalVolumeInput(settings["globalVolume"]);
        } else if(type == "settingsVideo") {
            setDisplayButton(settings["displayHoverName"]);
        }
    }, [type]);

    // RENDER
    if(type == "addSound") {
        return (
            <div id="modal" style={{display: show ? "unset" : "none"}} className="bg-[#000000]/50 absolute w-full h-full z-20 p-[38px]">
                <div className="w-full h-full flex justify-center items-end">
                    <div className="bg-[#11111B] w-[400px] h-[242px] rounded-[8px] border-[1.5px] border-[#BAC2DE]/40 p-[20px] flex flex-row justify-between">
                        <div className="h-full w-[206px] flex flex-col gap-[12px]">
                            <input value={nameInput} onChange={(e) => setNameInput(e.target.value)} type="text" placeholder="Name" className="w-full h-[32px] bg-[#BAC2DE]/8 border-[2px] border-[#BAC2DE]/40 rounded-[8px] font-[Inter] text-[#BAC2DE] text-[14px] font-semibold leading-[32px] px-[12px]"/>
                            <div className="w-full h-[32px] flex flex-row items-center justify-between bg-[#BAC2DE]/8 border-[2px] border-[#BAC2DE]/40 rounded-[8px] pl-[12px]">
                                <input value={imageInput} onChange={(e) => setImageInput(e.target.value)} type="text" placeholder="Image Path" className="w-[100%] h-[25px] bg-transparent font-[Inter] text-[#BAC2DE] text-[14px] font-semibold leading-[32px]"/>
                                <button onClick={() => handleImageInput()} className="w-[40px] h-[28px] flex justify-center items-center border-l-[2px] border-[#BAC2DE]/40 ml-[12px] cursor-pointer"><img src={document.querySelector("#hidden-folder-input")?.getAttribute("src") ?? undefined}/></button>
                            </div>
                            <div className="w-full h-[32px] flex flex-row items-center justify-between bg-[#BAC2DE]/8 border-[2px] border-[#BAC2DE]/40 rounded-[8px] pl-[12px]">
                                <input value={soundInput} onChange={(e) => setSoundInput(e.target.value)} type="text" placeholder="Sound Path" className="w-[100%] h-[25px] bg-transparent font-[Inter] text-[#BAC2DE] text-[14px] font-semibold leading-[32px]"/>
                                <button onClick={() => handleSoundInput()} className="w-[40px] h-[28px] flex justify-center items-center border-l-[2px] border-[#BAC2DE]/40 ml-[12px] cursor-pointer"><img src={document.querySelector("#hidden-folder-input")?.getAttribute("src") ?? undefined}/></button>
                            </div>
                            <div className="flex flex-row- gap-[12px]">
                                <input onChange={(e) => setButtonColor(e.target.value)} type="color" id="colorInput" className="hidden" />
                                <button onClick={() => document.getElementById("colorInput")!.click()} style={{backgroundColor: hexToRgba(buttonColor, 0.08), borderColor: hexToRgba(buttonColor, 0.4), color: `#${buttonColor.replace("#", "")}`}} className="w-[110px] h-[32px] flex justify-center items-center border-[2px] rounded-[8px] font-[Inter text-[14px] font-semibold leading-[32px] cursor-pointer">#{buttonColor.replace("#", "").toUpperCase()}</button>
                                <button onClick={() => setLoop(!loop)} className={loop ? "bg-[#89B4FA]/8 w-[32px] h-[32px] flex justify-center items-center border-[2px] border-[#89B4FA]/40 rounded-[8px] cursor-pointer" : "bg-[#BAC2DE]/8 w-[32px] h-[32px] flex justify-center items-center border-[2px] border-[#BAC2DE]/40 rounded-[8px] cursor-pointer"}><img src={loop ? document.querySelector("#hidden-loop-enabled")?.getAttribute("src") ?? undefined : document.querySelector("#hidden-loop-disabled")?.getAttribute("src") ?? undefined}/></button>
                            </div>
                        </div>
                        <div className="h-full min-w-[1.4px] bg-[#BAC2DE]/40 rounded-full"/>
                        <div className="h-full w-[105px] flex flex-col justify-between items-center">
                            <div style={{backgroundColor: hexToRgba(buttonColor, 0.08), borderColor: hexToRgba(buttonColor, 0.4)}} className="w-[70px] h-[70px] rounded-[12px] border-[2px] mt-[10px] flex justify-center items-center p-[12px] shadow-[inset_0px_0px_14px_10px_rgba(186,194,222,_0.05)]"><img className="w-full" src={imageInput !== "" ? convertFileSrc(imageInput) : document.querySelector("#hidden-sound")?.getAttribute("src") ?? undefined}/></div>
                            <div className="w-full flex flex-col gap-[10px]">
                                <button onClick={() => handleSubmit()} className="w-full h-[35px] bg-[#89B4FA]/8 border-[2px] border-[#89B4FA]/40 rounded-[8px] flex justify-center items-center cursor-pointer font-[Inter] text-[#BAC2DE] text-[15px] font-bold leading-[35px]">DONE</button>
                                <button onClick={() => handleClose()} className="w-full h-[35px] bg-[#D20F39]/8 border-[2px] border-[#D20F39]/40 rounded-[8px] flex justify-center items-center cursor-pointer font-[Inter] text-[#BAC2DE] text-[15px] font-bold leading-[35px]">CLOSE</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    } else if(type == "addFolder") {
        return (
            <div id="modal" style={{display: show ? "unset" : "none"}} className="bg-[#000000]/50 absolute w-full h-full z-20 p-[38px]">
                <div className="w-full h-full flex justify-center items-end">
                    <div className="bg-[#11111B] w-[400px] h-[242px] rounded-[8px] border-[1.5px] border-[#BAC2DE]/40 p-[20px] flex flex-row justify-between">
                        <div className="h-full w-[206px] flex flex-col gap-[12px]">
                            <input value={nameInput} onChange={(e) => setNameInput(e.target.value)} type="text" placeholder="Name" className="w-full h-[32px] bg-[#BAC2DE]/8 border-[2px] border-[#BAC2DE]/40 rounded-[8px] font-[Inter] text-[#BAC2DE] text-[14px] font-semibold leading-[32px] px-[12px]"/>
                            <div className="w-full h-[32px] flex flex-row items-center justify-between bg-[#BAC2DE]/8 border-[2px] border-[#BAC2DE]/40 rounded-[8px] pl-[12px]">
                                <input value={imageInput} onChange={(e) => setImageInput(e.target.value)} type="text" placeholder="Image Path" className="w-[100%] h-[25px] bg-transparent font-[Inter] text-[#BAC2DE] text-[14px] font-semibold leading-[32px]"/>
                                <button onClick={() => handleImageInput()} className="w-[40px] h-[28px] flex justify-center items-center border-l-[2px] border-[#BAC2DE]/40 ml-[12px] cursor-pointer"><img src={document.querySelector("#hidden-folder-input")?.getAttribute("src") ?? undefined}/></button>
                            </div>
                            <div className="flex flex-row- gap-[12px]">
                                <input onChange={(e) => setButtonColor(e.target.value)} type="color" id="colorInput" className="hidden" />
                                <button onClick={() => document.getElementById("colorInput")!.click()} style={{backgroundColor: hexToRgba(buttonColor, 0.08), borderColor: hexToRgba(buttonColor, 0.4), color: `#${buttonColor.replace("#", "")}`}} className="w-[110px] h-[32px] flex justify-center items-center border-[2px] rounded-[8px] font-[Inter text-[14px] font-semibold leading-[32px] cursor-pointer">#{buttonColor.replace("#", "").toUpperCase()}</button>
                            </div>
                        </div>
                        <div className="h-full min-w-[1.4px] bg-[#BAC2DE]/40 rounded-full"/>
                        <div className="h-full w-[105px] flex flex-col justify-between items-center">
                            <div style={{backgroundColor: hexToRgba(buttonColor, 0.08), borderColor: hexToRgba(buttonColor, 0.4)}} className="w-[70px] h-[70px] rounded-[12px] border-[2px] mt-[10px] flex justify-center items-center p-[12px] shadow-[inset_0px_0px_14px_10px_rgba(186,194,222,_0.05)]"><img className="w-full" src={imageInput !== "" ? convertFileSrc(imageInput) : document.querySelector("#hidden-folder")?.getAttribute("src") ?? undefined}/></div>
                            <div className="w-full flex flex-col gap-[10px]">
                                <button onClick={() => handleSubmit()} className="w-full h-[35px] bg-[#89B4FA]/8 border-[2px] border-[#89B4FA]/40 rounded-[8px] flex justify-center items-center cursor-pointer font-[Inter] text-[#BAC2DE] text-[15px] font-bold leading-[35px]">DONE</button>
                                <button onClick={() => handleClose()} className="w-full h-[35px] bg-[#D20F39]/8 border-[2px] border-[#D20F39]/40 rounded-[8px] flex justify-center items-center cursor-pointer font-[Inter] text-[#BAC2DE] text-[15px] font-bold leading-[35px]">CLOSE</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    } else if(type == "editSound") {
        return (
            <div id="modal" style={{display: show ? "unset" : "none"}} className="bg-[#000000]/50 absolute w-full h-full z-20 p-[38px]">
                <div className="w-full h-full flex justify-center items-end">
                    <div className="bg-[#11111B] w-[400px] h-[242px] rounded-[8px] border-[1.5px] border-[#BAC2DE]/40 p-[20px] flex flex-row justify-between">
                        <div className="h-full w-[206px] flex flex-col gap-[12px]">
                            <input value={nameInput} onChange={(e) => setNameInput(e.target.value)} type="text" placeholder="Name" className="w-full h-[32px] bg-[#BAC2DE]/8 border-[2px] border-[#BAC2DE]/40 rounded-[8px] font-[Inter] text-[#BAC2DE] text-[14px] font-semibold leading-[32px] px-[12px]"/>
                            <div className="w-full h-[32px] flex flex-row items-center justify-between bg-[#BAC2DE]/8 border-[2px] border-[#BAC2DE]/40 rounded-[8px] pl-[12px]">
                                <input value={imageInput} onChange={(e) => setImageInput(e.target.value)} type="text" placeholder="Image Path" className="w-[100%] h-[25px] bg-transparent font-[Inter] text-[#BAC2DE] text-[14px] font-semibold leading-[32px]"/>
                                <button onClick={() => handleImageInput()} className="w-[40px] h-[28px] flex justify-center items-center border-l-[2px] border-[#BAC2DE]/40 ml-[12px] cursor-pointer"><img src={document.querySelector("#hidden-folder-input")?.getAttribute("src") ?? undefined}/></button>
                            </div>
                            <div className="w-full h-[32px] flex flex-row items-center justify-between bg-[#BAC2DE]/8 border-[2px] border-[#BAC2DE]/40 rounded-[8px] pl-[12px]">
                                <input value={soundInput} onChange={(e) => setSoundInput(e.target.value)} type="text" placeholder="Sound Path" className="w-[100%] h-[25px] bg-transparent font-[Inter] text-[#BAC2DE] text-[14px] font-semibold leading-[32px]"/>
                                <button onClick={() => handleSoundInput()} className="w-[40px] h-[28px] flex justify-center items-center border-l-[2px] border-[#BAC2DE]/40 ml-[12px] cursor-pointer"><img src={document.querySelector("#hidden-folder-input")?.getAttribute("src") ?? undefined}/></button>
                            </div>
                            <div className="flex flex-row- gap-[12px]">
                                <input onChange={(e) => setButtonColor(e.target.value)} type="color" id="colorInput" className="hidden" />
                                <button onClick={() => document.getElementById("colorInput")!.click()} style={{backgroundColor: hexToRgba(buttonColor, 0.08), borderColor: hexToRgba(buttonColor, 0.4), color: `#${buttonColor.replace("#", "")}`}} className="w-[110px] h-[32px] flex justify-center items-center border-[2px] rounded-[8px] font-[Inter text-[14px] font-semibold leading-[32px] cursor-pointer">#{buttonColor.replace("#", "").toUpperCase()}</button>
                                <button onClick={() => setLoop(!loop)} className={loop ? "bg-[#89B4FA]/8 w-[32px] h-[32px] flex justify-center items-center border-[2px] border-[#89B4FA]/40 rounded-[8px] cursor-pointer" : "bg-[#BAC2DE]/8 w-[32px] h-[32px] flex justify-center items-center border-[2px] border-[#BAC2DE]/40 rounded-[8px] cursor-pointer"}><img src={loop ? document.querySelector("#hidden-loop-enabled")?.getAttribute("src") ?? undefined : document.querySelector("#hidden-loop-disabled")?.getAttribute("src") ?? undefined}/></button>
                            </div>
                        </div>
                        <div className="h-full min-w-[1.4px] bg-[#BAC2DE]/40 rounded-full"/>
                        <div className="h-full w-[105px] flex flex-col justify-between items-center">
                            <div style={{backgroundColor: hexToRgba(buttonColor, 0.08), borderColor: hexToRgba(buttonColor, 0.4)}} className="w-[70px] h-[70px] rounded-[12px] border-[2px] mt-[10px] flex justify-center items-center p-[12px] shadow-[inset_0px_0px_14px_10px_rgba(186,194,222,_0.05)]"><img className="w-full" src={imageInput !== "" ? convertFileSrc(imageInput) : document.querySelector("#hidden-sound")?.getAttribute("src") ?? undefined}/></div>
                            <div className="w-full flex flex-col gap-[10px]">
                                <button onClick={() => handleEdit()} className="w-full h-[35px] bg-[#89B4FA]/8 border-[2px] border-[#89B4FA]/40 rounded-[8px] flex justify-center items-center cursor-pointer font-[Inter] text-[#BAC2DE] text-[15px] font-bold leading-[35px]">APPLY</button>
                                <button onClick={() => handleClose()} className="w-full h-[35px] bg-[#D20F39]/8 border-[2px] border-[#D20F39]/40 rounded-[8px] flex justify-center items-center cursor-pointer font-[Inter] text-[#BAC2DE] text-[15px] font-bold leading-[35px]">CLOSE</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    } else if(type == "editFolder") {
        return (
            <div id="modal" style={{display: show ? "unset" : "none"}} className="bg-[#000000]/50 absolute w-full h-full z-20 p-[38px]">
                <div className="w-full h-full flex justify-center items-end">
                    <div className="bg-[#11111B] w-[400px] h-[242px] rounded-[8px] border-[1.5px] border-[#BAC2DE]/40 p-[20px] flex flex-row justify-between">
                        <div className="h-full w-[206px] flex flex-col gap-[12px]">
                            <input value={nameInput} onChange={(e) => setNameInput(e.target.value)} type="text" placeholder="Name" className="w-full h-[32px] bg-[#BAC2DE]/8 border-[2px] border-[#BAC2DE]/40 rounded-[8px] font-[Inter] text-[#BAC2DE] text-[14px] font-semibold leading-[32px] px-[12px]"/>
                            <div className="w-full h-[32px] flex flex-row items-center justify-between bg-[#BAC2DE]/8 border-[2px] border-[#BAC2DE]/40 rounded-[8px] pl-[12px]">
                                <input value={imageInput} onChange={(e) => setImageInput(e.target.value)} type="text" placeholder="Image Path" className="w-[100%] h-[25px] bg-transparent font-[Inter] text-[#BAC2DE] text-[14px] font-semibold leading-[32px]"/>
                                <button onClick={() => handleImageInput()} className="w-[40px] h-[28px] flex justify-center items-center border-l-[2px] border-[#BAC2DE]/40 ml-[12px] cursor-pointer"><img src={document.querySelector("#hidden-folder-input")?.getAttribute("src") ?? undefined}/></button>
                            </div>
                            <div className="flex flex-row- gap-[12px]">
                                <input onChange={(e) => setButtonColor(e.target.value)} type="color" id="colorInput" className="hidden" />
                                <button onClick={() => document.getElementById("colorInput")!.click()} style={{backgroundColor: hexToRgba(buttonColor, 0.08), borderColor: hexToRgba(buttonColor, 0.4), color: `#${buttonColor.replace("#", "")}`}} className="w-[110px] h-[32px] flex justify-center items-center border-[2px] rounded-[8px] font-[Inter text-[14px] font-semibold leading-[32px] cursor-pointer">#{buttonColor.replace("#", "").toUpperCase()}</button>
                            </div>
                        </div>
                        <div className="h-full min-w-[1.4px] bg-[#BAC2DE]/40 rounded-full"/>
                        <div className="h-full w-[105px] flex flex-col justify-between items-center">
                            <div style={{backgroundColor: hexToRgba(buttonColor, 0.08), borderColor: hexToRgba(buttonColor, 0.4)}} className="w-[70px] h-[70px] rounded-[12px] border-[2px] mt-[10px] flex justify-center items-center p-[12px] shadow-[inset_0px_0px_14px_10px_rgba(186,194,222,_0.05)]"><img className="w-full" src={imageInput !== "" ? convertFileSrc(imageInput) : document.querySelector("#hidden-folder")?.getAttribute("src") ?? undefined}/></div>
                            <div className="w-full flex flex-col gap-[10px]">
                                <button onClick={() => handleEdit()} className="w-full h-[35px] bg-[#89B4FA]/8 border-[2px] border-[#89B4FA]/40 rounded-[8px] flex justify-center items-center cursor-pointer font-[Inter] text-[#BAC2DE] text-[15px] font-bold leading-[35px]">DONE</button>
                                <button onClick={() => handleClose()} className="w-full h-[35px] bg-[#D20F39]/8 border-[2px] border-[#D20F39]/40 rounded-[8px] flex justify-center items-center cursor-pointer font-[Inter] text-[#BAC2DE] text-[15px] font-bold leading-[35px]">CLOSE</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    } else if(type == "settingsAudio") {
        return (
            <div id="modal" style={{display: show ? "unset" : "none"}} className="bg-[#000000]/50 absolute w-full h-full z-20 p-[38px]">
                <div className="w-full h-full flex justify-center items-end">
                    <div className="bg-[#11111B] w-[400px] h-[242px] rounded-[8px] border-[1.5px] border-[#BAC2DE]/40 p-[20px] flex flex-row justify-between gap-[20px]">
                        <div className="h-full min-w-[116px] flex flex-col gap-[12px]">
                            <button onClick={() => setType("settingsAudio")} className="w-full h-[33px] bg-[#89B4FA]/8 border-[2px] border-[#89B4FA]/40 rounded-[8px] flex items-center leading-[33px] px-[12px] font-[Inter] font-semibold text-[14px] text-[#BAC2DE] cursor-pointer">Audio</button>
                            <button onClick={() => setType("settingsVideo")} className="w-full h-[33px] bg-[#BAC2DE]/8 border-[2px] border-[#BAC2DE]/40 rounded-[8px] flex items-center leading-[33px] px-[12px] font-[Inter] font-semibold text-[14px] text-[#BAC2DE]/40 cursor-pointer">Video</button>
                            <button onClick={() => setType("settingsTheme")} className="w-full h-[33px] bg-[#BAC2DE]/8 border-[2px] border-[#BAC2DE]/40 rounded-[8px] flex items-center leading-[33px] px-[12px] font-[Inter] font-semibold text-[14px] text-[#BAC2DE]/40 cursor-pointer">Theme</button>
                            <button onClick={() => setShow(false)} className="w-full h-[33px] bg-[#D20F39]/8 border-[2px] border-[#D20F39]/40 rounded-[8px] flex items-center leading-[33px] px-[12px] font-[Inter] font-semibold text-[14px] text-[#BAC2DE] cursor-pointer">Close</button>
                        </div>
                        <div className="h-full min-w-[1.4px] bg-[#BAC2DE]/40 rounded-full"/>
                        <div className="h-full w-full flex flex-col justify-center items-center">
                            {/*
                            <div className="w-full flex flex-row items-center justify-between border-b-[1px] border-[#BAC2DE]/40 pb-[7px]">
                                <div className="w-full flex flex-col gap-[5px]">
                                    <p className="font-[Inter] font-semibold text-[13px] text-[#BAC2DE]">Global Volume</p>
                                    <input value={globalVolumeInput} onMouseUp={() => handleVolumeMouseUp()} onChange={(value) => handleVolumeChange(value)} style={{background: `linear-gradient(to right, #89B4FA80 ${globalVolumeInput-3}%, #BAC2DE66 ${globalVolumeInput}%)`}} className="w-full h-[7px] appearance-none cursor-pointer rounded-full [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-[12px] [&::-webkit-slider-thumb]:w-[12px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#89B4FA]" type="range" name="volume" id="globalVolume" min={0} max={100} />
                                </div>
                            </div>
                            */}
                            <p className="text-center font-[Inter] font-semibold text-[13px] text-[#BAC2DE]">There are no audio settings yet. Maybe in future.</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    } else if(type == "settingsVideo") {
        return (
            <div id="modal" style={{display: show ? "unset" : "none"}} className="bg-[#000000]/50 absolute w-full h-full z-20 p-[38px]">
                <div className="w-full h-full flex justify-center items-end">
                    <div className="bg-[#11111B] w-[400px] h-[242px] rounded-[8px] border-[1.5px] border-[#BAC2DE]/40 p-[20px] flex flex-row justify-between gap-[20px]">
                        <div className="h-full min-w-[116px] flex flex-col gap-[12px]">
                            <button onClick={() => setType("settingsAudio")} className="w-full h-[33px] bg-[#BAC2DE]/8 border-[2px] border-[#BAC2DE]/40 rounded-[8px] flex items-center leading-[33px] px-[12px] font-[Inter] font-semibold text-[14px] text-[#BAC2DE]/40 cursor-pointer">Audio</button>
                            <button onClick={() => setType("settingsVideo")} className="w-full h-[33px] bg-[#89B4FA]/8 border-[2px] border-[#89B4FA]/40 rounded-[8px] flex items-center leading-[33px] px-[12px] font-[Inter] font-semibold text-[14px] text-[#BAC2DE] cursor-pointer">Video</button>
                            <button onClick={() => setType("settingsTheme")} className="w-full h-[33px] bg-[#BAC2DE]/8 border-[2px] border-[#BAC2DE]/40 rounded-[8px] flex items-center leading-[33px] px-[12px] font-[Inter] font-semibold text-[14px] text-[#BAC2DE]/40 cursor-pointer">Theme</button>
                            <button onClick={() => setShow(false)} className="w-full h-[33px] bg-[#D20F39]/8 border-[2px] border-[#D20F39]/40 rounded-[8px] flex items-center leading-[33px] px-[12px] font-[Inter] font-semibold text-[14px] text-[#BAC2DE] cursor-pointer">Close</button>
                        </div>
                        <div className="h-full min-w-[1.4px] bg-[#BAC2DE]/40 rounded-full"/>
                        <div className="h-full w-full flex flex-col justify-between items-center">
                            <div className="w-full flex flex-row items-center justify-between border-b-[1px] border-[#BAC2DE]/40 pb-[7px]">
                                <div className="w-[145px] flex flex-col">
                                    <p className="font-[Inter] font-semibold text-[13px] text-[#BAC2DE]">Display button name</p>
                                    <p className="font-[Inter] font-medium text-[10px] text-[#BAC2DE]/60 leading-[11px]">Show the button name when the mouse hovers over it</p>
                                </div>
                                <button onClick={() => handleSetSettings("displayHoverName")} className={displayButton ? "w-[18px] h-[18px] rounded-[5px] bg-[#89B4FA]/8 border-[1px] border-[#89B4FA]/40 cursor-pointer flex justify-center items-center pt-[2px]" : "w-[18px] h-[18px] rounded-[5px] bg-[#BAC2DE]/8 border-[1px] border-[#BAC2DE]/40 cursor-pointer"}><img src={displayButton ? document.querySelector("#hidden-check")?.getAttribute("src") ?? undefined : undefined}/></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    } else if(type == "settingsTheme") {
        return (
            <div id="modal" style={{display: show ? "unset" : "none"}} className="bg-[#000000]/50 absolute w-full h-full z-20 p-[38px]">
                <div className="w-full h-full flex justify-center items-end">
                    <div className="bg-[#11111B] w-[400px] h-[242px] rounded-[8px] border-[1.5px] border-[#BAC2DE]/40 p-[20px] flex flex-row justify-between gap-[20px]">
                        <div className="h-full min-w-[116px] flex flex-col gap-[12px]">
                            <button onClick={() => setType("settingsAudio")} className="w-full h-[33px] bg-[#BAC2DE]/8 border-[2px] border-[#BAC2DE]/40 rounded-[8px] flex items-center leading-[33px] px-[12px] font-[Inter] font-semibold text-[14px] text-[#BAC2DE]/40 cursor-pointer">Audio</button>
                            <button onClick={() => setType("settingsVideo")} className="w-full h-[33px] bg-[#BAC2DE]/8 border-[2px] border-[#BAC2DE]/40 rounded-[8px] flex items-center leading-[33px] px-[12px] font-[Inter] font-semibold text-[14px] text-[#BAC2DE]/40 cursor-pointer">Video</button>
                            <button onClick={() => setType("settingsTheme")} className="w-full h-[33px] bg-[#89B4FA]/8 border-[2px] border-[#89B4FA]/40 rounded-[8px] flex items-center leading-[33px] px-[12px] font-[Inter] font-semibold text-[14px] text-[#BAC2DE] cursor-pointer">Theme</button>
                            <button onClick={() => setShow(false)} className="w-full h-[33px] bg-[#D20F39]/8 border-[2px] border-[#D20F39]/40 rounded-[8px] flex items-center leading-[33px] px-[12px] font-[Inter] font-semibold text-[14px] text-[#BAC2DE] cursor-pointer">Close</button>
                        </div>
                        <div className="h-full min-w-[1.4px] bg-[#BAC2DE]/40 rounded-full"/>
                        <div className="h-full w-full flex flex-col justify-center items-center">
                            <p className="text-center font-[Inter] font-semibold text-[13px] text-[#BAC2DE]">{"I’m still working on this :( Check GitHub for updates!"}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}