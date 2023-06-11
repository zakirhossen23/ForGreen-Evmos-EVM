import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import NavLink from 'next/link';
import SlideShow from '..//..//..//components/components/Slideshow';
import ChooseProjectModal from '../../../components/components/modals/ChooseProjectModal';
import useContract from '../../../services/useContract';
import { Header } from '../../../components/layout/Header'
import isServer from '../../../components/isServer';

export default function AuctionNFT(user) {

    const { contract, signerAddress,sendTransaction } = useContract();
    const router = useRouter();
    const [grantId, setgrantId] = useState(-1);
    const [list, setList] = useState([]);
    const [Judgersdata, setJudgersdata] = useState([]);
    const [isJudger, setisJudger] = useState(false);
    const [imageList, setimageList] = useState([]);
    const [title, setTitle] = useState('');
    const [goalusd, setgoalusd] = useState('');
    const [goal, setgoal] = useState('');
    const [EventDescription, setEventDescription] = useState('');
    const [EventWallet, setEventWallet] = useState('');
    const [date, setdate] = useState('');
    const [logo, setlogo] = useState('');
    const [eventuri, setEventuri] = useState('');
    const [ShowChooseProjectModal, setShowChooseProjectModal] = useState(false);

    const formatter = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    let m;
    let id = "";
    function LeftDate(datetext) {
        var c = new Date(datetext).getTime();
        var n = new Date().getTime();
        var d = c - n;
        var da = Math.floor(d / (1000 * 60 * 60 * 24));
        var h = Math.floor((d % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var m = Math.floor((d % (1000 * 60 * 60)) / (1000 * 60));
        var s = Math.floor((d % (1000 * 60)) / 1000);
        return (da.toString() + " Days " + h.toString() + " hours " + m.toString() + " minutes " + s.toString() + " seconds");
    }
    function LeftDateBid(datetext) {
        var c = new Date(datetext).getTime();
        var n = new Date().getTime();
        var d = c - n;
        var da = Math.floor(d / (1000 * 60 * 60 * 24));
        var h = Math.floor((d % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var m = Math.floor((d % (1000 * 60 * 60)) / (1000 * 60));
        var s = Math.floor((d % (1000 * 60)) / 1000);
        return (da.toString() + "d " + h.toString() + "h " + m.toString() + "m " + s.toString() + "s");
    }

    useEffect(() => {
        if (!isServer()) {
            fetchContractData();
        }

    }, [id, contract]);
    if (isServer()) return null;
    const regex = /\[(.*)\]/g;
    const str = decodeURIComponent(window.location.search);

    while ((m = regex.exec(str)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }
        id = m[1];
    }

    async function fetchContractData() {
        try {
            if (contract && id) {
                setgrantId(Number(id));
                const value = await contract._GrantEventURIs(Number(id)).call();

                const AllProjects = await contract.getSearchedProjectByGrantID(Number(id)).call();
                const arr = [];
                for (let i = 0; i < AllProjects.length; i++) {
                    let porjectID = Number(AllProjects[i])
                    let value2 =    await contract.eventURI(porjectID).call();
                 
                    let totalEarned = await contract.getEventRaised(porjectID).call();
                    const votes = await contract.getSearchedGrantVoteProject(Number(id),porjectID).call();
                    if (value2) {
                        const object = JSON.parse(value2[1]);
                      
                        let isvoted = false;
                        for (let index = 0; index < votes.length; index++) {
                            const element = votes[index];
                            if (element.toLowerCase() == window.ethereum.selectedAddress.toLowerCase() ){
                                isvoted= true;
                            }                            
                        }
                        if (value2[0].toLowerCase() === window.ethereum.selectedAddress.toLowerCase()){
                            isvoted= true;
                        }
                        arr.push({
                            eventId: porjectID,
                            Title: object.properties.Title.description,
                            Description: object.properties.Description.description,
                            Goal: object.properties.Goal.description,
                            Earned: Number(totalEarned),
                            logo: object.properties.logo.description.url,
                            votecount: votes.length,
                            isVoted: isvoted
                        });
                    }
                }
                arr.sort(function(a, b){return a.votecount - b.votecount});
                setList(arr);

                console.log(arr);
                if (document.getElementById("Loading"))
                    document.getElementById("Loading").style = "display:none";


                setEventuri(value);

                const object = JSON.parse(value);
                console.log(object);
                for (let index = 0; index < object.properties.Judgersdata.length; index++) {
                    const element = object.properties.Judgersdata[index];
                    setJudgersdata((pre) => [...pre, element.wallet]);
                    if (element.wallet.toLowerCase() == window.ethereum.selectedAddress.toLowerCase()) {
                        setisJudger(true);
                    }
                }

                setimageList(object.properties.allFiles);
                setTitle(object.properties.Title.description);
                setgoalusd(formatter.format(Number(object.properties.Price.description * 1.10)));
                setgoal(Number(object.properties.Price.description));
                setEventDescription(object.properties.Description.description)
                setEventWallet(object.properties.wallet.description)
                setdate(object.properties.Date.description);
                setlogo(object.properties.logo.description);

            }
        } catch (error) {
            console.error(error);
        }
    }


    async function VoteProject(projectid) {
        try {
            const result = await sendTransaction(contract.createGrantVote(window.ethereum.selectedAddress, projectid, Number(id)));
            window.location.reload();
        } catch (e) {
            return;
        }

    }

    setInterval(function () {
        calculateTimeLeft();
    }, 1000);


    function calculateTimeLeft() {
        try {
            var allDates = document.getElementsByName("dateleft");
            for (let i = 0; i < allDates.length; i++) {
                var date = (allDates[i]).getAttribute("date");
                allDates[i].innerHTML = LeftDate(date);
            }
            var allDates = document.getElementsByName("date");
            for (let i = 0; i < allDates.length; i++) {
                var date = (allDates[i]).getAttribute("date");
                allDates[i].innerHTML = LeftDateBid(date);
            }
        } catch (error) {

        }

    }


    function submitProject() {
        setShowChooseProjectModal(true);
    }
    return (
        <>
            <Head>
                <title>{title}</title>
                <meta name="description" content={title} />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Header></Header>


            <div className="p-campaign" data-view-id="pg_donate_index" >
                <div className="p-campaign-collage color-background-blue" >
                    <SlideShow images={imageList} />

                </div>
                <header className="p-campaign-header" >
                    <h1 className="mb0 a-campaign-title">
                        {title}
                    </h1>
                </header>
                <div className="p-campaign-sidebar" >
                    <aside className="o-campaign-sidebar" >
                        <div className="o-campaign-sidebar-wrapper" >
                            <span name="dateleft" date={date} className="tittle-title" >
                                Days Left
                            </span>
                            <div className="o-campaign-sidebar-progress-meter m-progress-meter">
                                <h2 className="m-progress-meter-heading" >
                                    <span className="text-stat text-stat-title" >
                                        Prize: {goal} tEVMOS
                                    </span>
                                </h2>
                            </div>
                            <div className="p-campaign-share-donate-buttons">
                                <a
                                    className="p-campaign-share-button-exp mb2x m-auto hrt-gradient-button hrt-gradient-button--gradient-orange hrt-gradient-button--full hrt-gradient-button--shadow hrt-base-button"
                                    data-element-id="btn_donate"
                                    data-analytic-event-listener="true"
                                    onClick={submitProject}
                                >
                                    <span className="hrt-gradient-button-text">Submit Project</span>
                                </a>
                            </div>
                        </div>
                    </aside>
                </div>
                <div className="p-campaign-description" style={{ gridArea: "description" }}>
                    <div className="m-campaign-byline">
                        <div className="m-campaign-byline-members">
                            <ul className="list-unstyled hrt-avatar-stack m-campaign-byline-avatar-stack" />
                            <div
                                className="m-campaign-byline-description"
                                style={{
                                    alignItems: 'center',
                                    display: 'flex',
                                    margin: '1rem',
                                    marginBottom: '1rem'
                                }}
                            >
                                Description
                            </div>
                        </div>
                    </div>
                    <div className="mb0 mt0 hrt-rule hrt-rule--horizontal" />
                    <div
                        className="o-campaign-description"
                        style={{
                            maxWidth: 664,
                            position: "relative",
                            gridArea: "description",
                            marginTop: "1.5rem",
                            boxSizing: "inherit"
                        }}
                    >
                        <div className="o-campaign-story mt3x" >
                            {EventDescription}
                        </div>
                    </div>
                </div>
            </div>


            <div id='Loading' className="LoadingArea">
                <h1>Loading...</h1>
            </div>
            <div className='auction NFTs-container' >
                {list.map((listItem) => (
                    <div key={listItem.eventId} className="row auction ElementsContainer bgWhite">
                        <div className='auction NFt-contain' >

                            <img src={listItem.logo} className="auction AuctionBidImage" />
                            <div style={{ width: '100%', display: 'flex', height: '100%', padding: '5px 0px', position: 'relative', flexDirection: 'column', justifyContent: 'space-around' }}>
                                <div className="Grant-DetialsContainer" style={{ rowGap: "5px" }} >
                                    <h6 className='Auction NFT-title'>{listItem.Title}</h6>
                                    <div className="TextContainer">
                                        <h6 className="Grant NFT-Description" style={{ color: "#dee2e6" }}>{listItem.Description}</h6>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '11px' }}>
                                    <h6 className='Auction priceText bidprice'>Voted: {listItem.votecount}</h6>
                                    <h6 className="Auction Grey-text smallgrey">Goal: {listItem.Goal} tEVMOS</h6>
                                </div>
                                <div className='Grant-ElementBottomContainer'>

                                    <div className='BidAllcontainer' >
                                        <div className='Grant-Projectcontainer' >

                                            {(window.localStorage.getItem('Type') != "" && window.localStorage.getItem('Type') != null && isJudger == true && listItem.isVoted != true) ? (<>
                                                <div onClick={() => { VoteProject(listItem.eventId) }} className="col">
                                                    <div className=" ProjectcontainerCard">
                                                        <div className="card-body ProjectbuttonText">Vote</div>
                                                    </div>
                                                </div>
                                            </>) : (<>

                                            </>)}

                                            <NavLink href={`/donation/auction?[${listItem.eventId}]`}>
                                                <div className=" col">
                                                    <div className="ProjectcontainerCard">
                                                        <div className="card-body ProjectbuttonText">Go to project</div>
                                                    </div>
                                                </div>
                                            </NavLink >
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <ChooseProjectModal
                show={ShowChooseProjectModal}
                onHide={() => {
                    setShowChooseProjectModal(false);
                }}
                contract={contract}
                sendTransaction={sendTransaction}
                grantId={grantId}
            />
        </>
    );
}
