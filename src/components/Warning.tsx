import { BaseDirectory, writeTextFile } from '@tauri-apps/plugin-fs';

export default function Warning({data, setData, show, setShow, type, parent, page, buttonToEdit, audios, setAudios}:any) {
    // VARIABLE
    
    // FUNCTION
    function getAllChildren(folder:any, data:any) {
        const result:any[] = [];
        function findChildren(parentName:any) {
            const children = data.filter((item:any) => item.parent === parentName);
            for (const child of children) {
                result.push(child);
                findChildren(child.name);
            }
        }
        findChildren(folder);
        return result;
    }

    const handleHide = async () => {
        setShow(false);
    };

    const handleDelete = async (type:string) => {
        const editingButton = data.filter((button:any) => button["parent"] == parent).filter((button:any) => button["pos"] == buttonToEdit).filter((button:any) => button["page"] == page)[0];
        if(type == "folder") {
            const childrens = getAllChildren(editingButton["name"], data);
            setData(data.filter((button:any) => !childrens.includes(button)).filter((button:any) => `${button["parent"]}-${button["page"]}-${button["pos"]}` !== `${parent}-${page}-${buttonToEdit}`));
            await writeTextFile('deckData.json', JSON.stringify(data.filter((button:any) => !childrens.includes(button)).filter((button:any) => `${button["parent"]}-${button["page"]}-${button["pos"]}` !== `${parent}-${page}-${buttonToEdit}`)), { baseDir: BaseDirectory.AppConfig });
            childrens.filter((child:any) => child["type"] == "sound").forEach((child:any) => {
                audios.filter((audio:any) => audio["id"] == `${child["parent"]}-${child["page"]}-${child["pos"]}`).forEach((audio:any) => {
                    audio.pause();
                    audio.currentTime = 0;
                });
                setAudios(audios.filter((audio:any) => audio["id"] !== `${child["parent"]}-${child["page"]}-${child["pos"]}`));
            });
        } else if(type == "sound") {
            setData(data.filter((button:any) => `${button["parent"]}-${button["page"]}-${button["pos"]}` !== `${parent}-${page}-${buttonToEdit}`))
            await writeTextFile('deckData.json', JSON.stringify(data.filter((button:any) => `${button["parent"]}-${button["page"]}-${button["pos"]}` !== `${parent}-${page}-${buttonToEdit}`)), { baseDir: BaseDirectory.AppConfig });
            audios.filter((audio:any) => audio["id"] == `${parent}-${page}-${buttonToEdit}`).forEach((audio:any) => {
                audio.pause();
                audio.currentTime = 0;
            });
            setAudios(audios.filter((audio:any) => audio["id"] !== `${parent}-${page}-${buttonToEdit}`));
        }
    };

    // RENDER
    if(type == "folderNameExist") {
        return (
            <div onClick={handleHide} id="warning" style={{display: show ? "unset" : "none"}} className="bg-[#000000]/50 absolute w-full h-full z-30 p-[38px]">
                <div className="w-full h-full flex justify-center items-center">
                    <div className="bg-[#11111B] w-[204px] rounded-[8px] border-[1.5px] border-[#BAC2DE]/40 p-[14px] flex flex-col gap-[14px] justify-between">
                        <p className="font-[Inter] text-center text-[15px] font-semibold text-[#BAC2DE]">There’s already a folder with that name.</p>
                        <div className="w-full flex flex-row justify-center items-center">
                            <button className="w-[80px] h-[30px] bg-[#D20F39]/8 border-[2px] border-[#D20F39]/40 rounded-[6px] flex justify-center items-center cursor-pointer font-[Inter] text-[#BAC2DE] text-[13px] font-bold leading-[30px]">CLOSE</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    } else if(type == "deleteSound") {
        return (
            <div onClick={handleHide} id="warning" style={{display: show ? "unset" : "none"}} className="bg-[#000000]/50 absolute w-full h-full z-30 p-[38px]">
                <div className="w-full h-full flex justify-center items-center">
                    <div className="bg-[#11111B] w-[204px] rounded-[8px] border-[1.5px] border-[#BAC2DE]/40 p-[14px] flex flex-col gap-[14px] justify-between">
                        <p className="font-[Inter] text-center text-[15px] font-semibold text-[#BAC2DE]">Do you want to delete this sound?</p>
                        <div className="w-full flex flex-row justify-between items-center">
                            <button onClick={() => handleDelete("sound")} className="w-[80px] h-[30px] bg-[#89B4FA]/8 border-[2px] border-[#89B4FA]/40 rounded-[6px] flex justify-center items-center cursor-pointer font-[Inter] text-[#BAC2DE] text-[13px] font-bold leading-[30px]">CONFIRM</button>
                            <button className="w-[80px] h-[30px] bg-[#D20F39]/8 border-[2px] border-[#D20F39]/40 rounded-[6px] flex justify-center items-center cursor-pointer font-[Inter] text-[#BAC2DE] text-[13px] font-bold leading-[30px]">CLOSE</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    } else if(type == "deleteFolder") {
        return (
            <div onClick={handleHide} id="warning" style={{display: show ? "unset" : "none"}} className="bg-[#000000]/50 absolute w-full h-full z-30 p-[38px]">
                <div className="w-full h-full flex justify-center items-center">
                    <div className="bg-[#11111B] w-[204px] rounded-[8px] border-[1.5px] border-[#BAC2DE]/40 p-[14px] flex flex-col gap-[14px] justify-between">
                        <p className="font-[Inter] text-center text-[15px] font-semibold text-[#BAC2DE]">Do you want to delete this folder and all its buttons?</p>
                        <div className="w-full flex flex-row justify-between items-center">
                            <button onClick={() => handleDelete("folder")} className="w-[80px] h-[30px] bg-[#89B4FA]/8 border-[2px] border-[#89B4FA]/40 rounded-[6px] flex justify-center items-center cursor-pointer font-[Inter] text-[#BAC2DE] text-[13px] font-bold leading-[30px]">CONFIRM</button>
                            <button className="w-[80px] h-[30px] bg-[#D20F39]/8 border-[2px] border-[#D20F39]/40 rounded-[6px] flex justify-center items-center cursor-pointer font-[Inter] text-[#BAC2DE] text-[13px] font-bold leading-[30px]">CLOSE</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}