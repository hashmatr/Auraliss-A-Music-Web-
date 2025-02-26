let currentSong = new Audio();
let songs;
let currfolder;
function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return "00:00"; // Handle invalid input

    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60); // Ensure whole seconds

    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}
async function getsongs(folder) {
    currfolder = folder;
    let a = await fetch(`http://127.0.0.1:3000/${folder}/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
     songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }


    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    songUL.innerHTML = ""
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li>
                <img class="invert" src="music.svg" alt="">
                <div class="info">
                    <div>${song.replaceAll("%20", " ")}</div>
                    <div>Auraliss</div>
                </div>
                <div class="playnow">
                    <span>Play Now</span>
                <img class="invert" src="play.svg" alt="">
            </div>
               </li>`
    }
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        
        })
    })
    return songs;
}
const playMusic = (track, pause = false) => {
    currentSong.src = `/${currfolder}/` + track
    if (!pause) {
        currentSong.play();

        play.src = "pause.svg"
    } document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
    

}
 async function displayAlbums() {
    let a = await fetch(`http://127.0.0.1:3000/songs/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    let cardcontainer  = document.querySelector(".cardcontainer")
    let array = Array.from(anchors)
        for (let index = 0; index < array.length; index++) {
            const e = array[index];
            
     if(e.href.includes("/songs")){
        let folder = e.href.split("/").slice(-2)[0]
        //get metadata of the folder
        let a = await fetch(`http://127.0.0.1:3000/songs/${folder}/info.json`)
        let response = await a.json();
        cardcontainer.innerHTML = cardcontainer.innerHTML + `<div  data-folder="${folder}" class="card">
        <div class="play">
            <svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <!-- Outer Circle -->
                <circle cx="50" cy="50" r="40" fill="#8115e3" />

                <!-- Inner Play Button -->
                <polygon points="40,35 40,65 65,50" fill="#000000" />
            </svg>
        </div>
        <img src="/songs/${folder}/cover.jpg" alt="">
        <h2>${response.title}</h2>
        <p>${response.description}</p>
    </div> `
     }
    }
     // Load the playlist whenever card is clicked
 Array.from(document.getElementsByClassName("card")).forEach(e=>{
    e.addEventListener("click",async item=>{
        songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`);
        playMusic(songs[0])
    })
 }) 
    
 }
async function main() {

    await getsongs("songs/ncs");
    playMusic(songs[0], true);
    // display all the album on the page
  displayAlbums()
 
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "pause.svg"
        }
        else {
            currentSong.pause()
            play.src = "play.svg"
        }
    })
    currentSong.addEventListener("timeupdate", () => {
        console.log(currentSong.currentTime, currentSong.duration);
        document.querySelector(".songtime").innerHTML = `${formatTime(currentSong.currentTime)}/${formatTime(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%"
    })
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100; 
        document.querySelector(".circle").style.left = percent + "%"
        currentSong.currentTime = ((currentSong.duration)*percent)/100
    })
        document.querySelector(".hamburger").addEventListener("click",()=>{
        document.querySelector(".left").style.left = "0"
    });
    document.querySelector(".close").addEventListener("click",()=>{
        document.querySelector(".left").style.left = "-500px"
    });
    previous.addEventListener("click",()=>{
        let index =songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if((index-1)>=0){
        playMusic(songs[index-1])
 }
    })
    next.addEventListener("click",()=>{
        let index =songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if((index+1)<songs.length){
        playMusic(songs[index+1])
 } })
 //Add an event to volume
 document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
    currentSong.volume = parseInt(e.target.value)/100
 })
 document.querySelector(".volume>img").addEventListener("click",e=>{
    if(e.target.src.includes("volume.svg")){
        e.target.src = e.target.src.replace("volume.svg","mute.svg")
        currentSong.volume = 0;
        document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
    }
    else{
        e.target.src = e.target.src.replace("mute.svg","volume.svg")
        currentSong.volume = 0.1;
        document.querySelector(".range").getElementsByTagName("input")[0].value = 10;

    }
 })
}
main();