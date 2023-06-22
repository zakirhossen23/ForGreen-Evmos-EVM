import React, { useState } from 'react';
import Head from 'next/head';
import Button from 'react-bootstrap/Button';
import UseFormInput from '../../components/components/UseFormInput';
import UseFormTextArea from '../../components/components/UseFormTextArea';
import useContract from '../../services/useContract';
import { Header } from '../../components/layout/Header'
import NavLink from 'next/link';
import isServer from '../../components/isServer';
import { NFTStorage, File } from 'nft.storage'


export default function CreateGrantPoolEvents() {
    const { contract, signerAddress,sendTransaction } = useContract();
    const [EventImage, setEventImage] = useState([]);
    const NFT_STORAGE_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDJDMDBFOGEzZEEwNzA5ZkI5MUQ1MDVmNDVGNUUwY0Q4YUYyRTMwN0MiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY1NDQ3MTgxOTY2NSwibmFtZSI6IlplbmNvbiJ9.6znEiSkiLKZX-a9q-CKvr4x7HS675EDdaXP622VmYs8'
    const client = new NFTStorage({ token: NFT_STORAGE_TOKEN })
    
    const [EventTitle, EventTitleInput] = UseFormInput({
        defaultValue: "",
        type: 'text',
        placeholder: 'Event Title',
        id: ''
    });
    const [EventDescription, EventDescriptionInput] = UseFormTextArea({
        defaultValue: "",
        placeholder: 'Event Description',
        id: '',
        rows: 3
    });
    const [EventDate, EventDateInput] = UseFormInput({
        defaultValue: "",
        type: 'datetime-local',
        placeholder: 'Event End Date ',
        id: 'enddate',
    });
    const [EventPrice, EventPriceInput] = UseFormInput({
        defaultValue: "",
        type: 'text',
        placeholder: 'Total price in tEVMOS',
        id: 'price',
    });

    const [Judgersdata, setJudgersdata] = useState([
    ])
    
    
    function downloadURI(uri, name) {
        var link = document.createElement("a");
        link.download = name;
        link.href = uri;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
    }
    async function CreatePlugin(src) {
        const output = `<html><head></head><body><iframe src="${src}" style="width: 100%;height: 100%;" /></body></html>`;
        // Download it
        const blob = new Blob([output]);
        const fileDownloadUrl = URL.createObjectURL(blob);
        downloadURI(fileDownloadUrl, "Generated Plugin.html");
        console.log(output);
    }
    async function createEvent() {
        var CreateEVENTBTN = document.getElementById("CreateEVENTBTN")
        CreateEVENTBTN.disabled = true
        let allFiles = []
        for (let index = 0; index < EventImage.length; index++) {
            const element = EventImage[index];
            const metadata = await client.storeBlob(element)
            const urlImageEvent = {
                url: "https://" + metadata + ".ipfs.nftstorage.link",
                type: element.type
            }
            allFiles.push(urlImageEvent)
            console.log(urlImageEvent)
        }
        
        const createdObject = {
            title: 'Asset Metadata',
            type: 'object',
            properties: {
                Title: {
                    type: 'string',
                    description: EventTitle,
                },
                Description: {
                    type: 'string',
                    description: EventDescription,
                },
                Date: {
                    type: 'string',
                    description: EventDate,
                },
                Price: {
                    type: 'string',
                    description: EventPrice
                },
                logo: {
                    type: 'string',
                    description: allFiles[0]
                },
                wallet: {
                    type: 'string',
                    description:window.ethereum.selectedAddress
                },
                typeimg: {
                    type: 'string',
                    description: "Event"
                },
                allFiles,
                Judgersdata
            }
        };

        
        try {
            let eventid = await contract.totalGrantEvent().call();
            const result = await sendTransaction(contract.createGrantEvent(JSON.stringify(createdObject)));
                
                if (document.getElementById("plugin").checked) {
                    await CreatePlugin(`http://${window.location.host}/grantspoolevents/event?[${eventid}]`);
                }
                
            } catch {
                window.location.href = ('/login');
            }
        window.location.href = ('/grantspoolevents');
    }
    
    
    function CreateEventBTN() {
        if (window.localStorage.getItem("Type") != "manager" && typeof window.tronLink !== 'undefined') {
            return (<>
                <NavLink href="/login?[/CreateGrantEvents]">
                    <Button style={{ margin: "17px 0 0px 0px", width: "100%" }}>
                        Login as Event Manager
                    </Button>
                </NavLink>

            </>);
        }
        return (<>
            <Button id="CreateEVENTBTN" style={{ margin: "17px 0 0px 0px", width: "100%" }} onClick={createEvent}>
                Create Grant Pool Event
            </Button>
        </>)
    }
    function FilehandleChange(event) {
        var allNames = []
        for (let index = 0; index < event.target.files.length; index++) {
            const element = event.target.files[index].name;
            allNames.push(element)
        }
        for (let index2 = 0; index2 < event.target.files.length; index2++) {
            setEventImage((pre) => [...pre, event.target.files[index2]])
        }

    }

    function AddBTNClick(event) {
        var EventImagePic = document.getElementById("EventImage");
        EventImagePic.click();

    }

    function DeleteSelectedImages(event) {
        var DeleteBTN = event.currentTarget;
        var idImage = Number(DeleteBTN.getAttribute("id"))
        var newImages = [];
        var allUploadedImages = document.getElementsByName("deleteBTN");
        for (let index = 0; index < EventImage.length; index++) {
            if (index != idImage) {
                const elementDeleteBTN = allUploadedImages[index];
                elementDeleteBTN.setAttribute("id", newImages.length.toString())
                const element = EventImage[index];
                newImages.push(element);
            }
        }
        setEventImage(newImages);
        
    }
    
    
    function addJudger(id, value) {
        console.log("adding")
        setJudgersdata(prevState => [{
            wallet: value
        }, ...prevState]);
    }
    
    function deleteJudger(id) {
        console.log("deleting")
        let newArr = [];
        for (let index = 0; index < Judgersdata.length; index++) {
            if (index != id) {
                newArr.push(Judgersdata[index]);
            }
        }
        setJudgersdata(newArr);
        
    }
    
    
    
    
    function TemplateJudger({ walelt, id }) {
        let changedvalue = "";
        return <>
            <div style={{ display: "flex", alignItems: "center" }}>
                <input
                    defaultValue={walelt}
                    type="text"
                    onChange={(e) => { changedvalue = e.currentTarget.value }}
                    placeholder="Wallet Address"
                    className="form-control"
                    style={{ height: 40 }}
                />
                <input
                    type="button"
                    placeholder="Wallet Address"
                    defaultValue="+"
                    onClick={() => { addJudger(id, changedvalue) }}
                    style={{
                        height: 46,
                        width: 56,
                        margin: 0,
                        background: "white",
                        fontSize: 24,
                        borderRadius: 7
                    }}
                />
            </div>
        </>
    }

    function WrittenJudger({ walelt, id }) {
        return <>
            <div style={{ display: "flex", alignItems: "center" }}>
                <input
                    defaultValue={walelt}
                    type="text"
                    readOnly
                    className="form-control"
                    style={{ height: 40, background: 'gainsboro' }}
                />
                <Button
                    onClick={() => { deleteJudger(id) }}
                    style={{
                        height: 46,
                        overflow: "hidden",
                        width: 56,
                        background: "white",
                        margin: 0,
                        padding: 5,
                        fontSize: 24,
                        borderRadius: 7
                    }}
                    >
                    <img
                        src="https://th.bing.com/th/id/OIP.YH9brx_8F1JxgZAtUbN7XAHaHa?pid=ImgDet&rs=1"
                        style={{ width: "100%", maxWidth: "inherit", height: "100%" }}
                        />
                </Button>

            </div>
        </>
    }

    
    if (isServer()) return null;
    
    return (
        <><>
            <Head>
                <title>Create Event</title>
                <meta name="description" content="Create Event" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Header></Header>
            <div className="row" style={{ "height": "100%" }}>
                <div className='createevents col' >
                    <div style={{  padding: "19px", borderRadius: "4px", height: "100%", border: "white solid" }}>
                        <div style={{ margin: "0px 0px 30px 0px" }}>
                            <h1>Create Grant Pool Event</h1>
                        </div>

                        <div style={{ margin: "18px 0" }}>
                            <h6>Event Title</h6>
                            {EventTitleInput}
                        </div>

                        <div style={{ margin: "18px 0" }}>
                            <h6>Event Description</h6>
                            {EventDescriptionInput}
                        </div>

                        <div style={{ margin: "18px 0" }}>
                            <h6>Event End Date</h6>
                            {EventDateInput}
                        </div>

                        <div style={{ margin: "18px 0" }}>
                            <h6>Judgers</h6>
                            <div name="judgers-Container" style={{ height: 100, overflow: "auto" }}>
                                {Judgersdata.map((item, id) => {
                                    return <WrittenJudger key={id} walelt={item.wallet} id={id} />
                                })}
                                <TemplateJudger />
                            </div>

                        </div>

                        <div style={{ margin: "18px 0" }}>
                            <h6>Event Prize</h6>
                            {EventPriceInput}
                        </div>
                        <div style={{ height: '90px' }}>
                            <div className="Event-Create-file-container">
                                <input className="file-input" hidden onChange={FilehandleChange} id="EventImage" name="EventImage" type="file" multiple="multiple" />
                                <div className='Event-UploadedFileContainer'>
                                    {EventImage.map((item, i) => {
                                        return (<>
                                            <div key={i} className='Event-Images'>
                                                <button key={i} onClick={DeleteSelectedImages} name='deleteBTN' id={i}>X</button>
                                                {(item.type.includes("image")) ? (<img className='Event-Images-imagebox' src={URL.createObjectURL(item)} />) : (<>
                                                    <div key={i} className='Event-Uploaded-File-Container'>
                                                        <img className='Event-Uploaded-File-clip-icon' src='https://cdn1.iconfinder.com/data/icons/web-page-and-iternet/90/Web_page_and_internet_icons-10-512.png' />
                                                        <span className='Event-Uploaded-File-name'>{item.name.substring(0, 10)}...</span>
                                                    </div>
                                                </>
                                                )}

                                            </div>
                                        </>)

                                    })}
                                    <div className='Event-ImageAdd'>
                                        <button id='Add-Image' onClick={AddBTNClick} className='Event-ImageAdd-button'>
                                            +
                                        </button>
                                    </div>
                                </div>


                            </div>
                        </div>

                        <div style={{
                            margin: '18px 0px',
                            display: 'flex',
                            alignContent: 'center',
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: '5px'
                        }} >
                            <input type="checkbox" id="plugin" />
                            <h5 style={{ margin: '0' }}>Generate Plugin?</h5>
                        </div>
                        <CreateEventBTN />
                    </div>
                </div>
            </div>

        </>
        </>
    );
}
