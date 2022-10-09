let socket = new ReconnectingWebSocket("ws://127.0.0.1:24050/ws");
let scoreColor = document.getElementById('sbColor')
let score = document.getElementById('score');
let wrapper = document.getElementById('wrapper');
let rank = document.getElementById('rank');
let mods = document.getElementById('mods');
let title = document.getElementById('title');
let artist = document.getElementById('artist');
let ppmax = document.getElementById('ppmax');
let timer = document.getElementById('timer');

let widthBase = scoreColor.offsetWidth;

socket.onopen = () => {
    console.log("Successfully Connected");
};

socket.onclose = event => {
    console.log("Socket Closed Connection: ", event);
    socket.send("Client Closed!");
};

socket.onerror = error => {
    console.log("Socket Error: ", error);
};

let animation = {
    acc: new CountUp('accdata', 0, 0, 2, .2, {
        useEasing: true,
        useGrouping: true,
        separator: " ",
        decimal: "." 
    }),
    combo: new CountUp('combodata', 0, 0, 0, .2, {
        useEasing: true,
        useGrouping: true,
        separator: "",
        decimal: "." 
    }),
    comboshadow: new CountUp('comboshadowdata', 0, 0, 0, .2, {
        useEasing: true,
        useGrouping: true,
        separator: "",
        decimal: "."
    }),
    score: new CountUp('scoredata', 0, 0, 0, .5, {
        useEasing: true,
        useGrouping: true,
        separator: "",
        decimal: ".",
        formattingFn: (n) => { return n.toString().padStart(8,"0") } 
    }),
    pp: new CountUp('pp', 0, 0, 0, .2, {
        useEasing: true,
        useGrouping: true,
        separator: " ",
        decimal: "."
    }),
}

let tempState;
let tempShowInterface;
let tempCombo;
let tempTime;
let tempTimeMax;
let tempRank;
let tempMods;
let tempArtist;
let tempTitle;
let tempPP;

socket.onmessage = event => {  
    let data = JSON.parse(event.data);
    if (tempState !== data.menu.state || tempShowInterface !== data.settings.showInterface) {
        tempState = data.menu.state;
        tempShowInterface = data.settings.showInterface;
        if (tempState == 2 && tempShowInterface == 0) {
            wrapper.style.opacity = 1;
        } else {
            wrapper.style.opacity = 0;
        }
    }

    if (data.gameplay.hp.normal || data.gameplay.hp.normal === 0) {
        scoreColor.style.width = (widthBase/200) * data.gameplay.hp.normal + 'px';
    }
    if (data.gameplay.score != "") {
    	animation.score.update(data.gameplay.score);
    } else {
    	animation.score.update(0);
    }
    if (data.gameplay.accuracy != "" && data.gameplay.accuracy >= 0 && data.gameplay.accuracy <= 100) {
        animation.acc.update(data.gameplay.accuracy);
    } else {
    	animation.acc.update(100);
    }
    if (data.gameplay.pp.current != "") {
        animation.pp.update(data.gameplay.pp.current);
    } else {
        animation.pp.update(0);
    }
    if (tempPP != data.gameplay.pp.maxThisPlay) {
        tempPP = data.gameplay.pp.maxThisPlay;
        ppmax.innerHTML = tempPP;
    }
    if (data.gameplay.combo.current == "") {
    	animation.combo.update(0);
    	animation.comboshadow.update(0);
    } else if (tempCombo !== data.gameplay.combo.current) {
        tempCombo = data.gameplay.combo.current;
        animation.comboshadow.update(tempCombo);
        animation.combo.update(tempCombo);
        
        combo.classList.remove('combo-scale');
        comboShadow.classList.remove('comboShadow-scale');
        void combo.offsetWidth;
        void comboShadow.offsetWidth;
        combo.classList.add('combo-scale');
        comboShadow.classList.add('comboShadow-scale');
    }
    if (tempTime !== data.menu.bm.time.current || tempTimeMax !== data.menu.bm.time.full) {
        tempTime = data.menu.bm.time.current;
        if(tempTimeMax !== data.menu.bm.time.full) {
            tempTimeMax = data.menu.bm.time.full;
        }
        const time = (tempTime / tempTimeMax) * 100;
        const timeString = time.toString();
        const style = "conic-gradient(#999999 " + timeString + "%, rgba(0,0,0,0) 0)";
        timer.style.background = style;
    }

    if (data.gameplay.hits.grade.current === "") {
        tempRank = 'SS'
    } else {
        tempRank = data.gameplay.hits.grade.current;
    }

    const hdfl = (data.menu.mods.str.includes("HD") || data.menu.mods.str.includes("FL"));
    switch (tempRank) {
        case 'SS':
            if (hdfl) {
                rank.style.color = getComputedStyle(document.documentElement).getPropertyValue('--SHD');
            } else {
                rank.style.color = getComputedStyle(document.documentElement).getPropertyValue('--S');
            }
            break;
        case 'S':
            if (hdfl) {
                rank.style.color = getComputedStyle(document.documentElement).getPropertyValue('--SHD');
            } else {
                rank.style.color = getComputedStyle(document.documentElement).getPropertyValue('--S');
            }
            break;
        case 'A': 
            rank.style.color = getComputedStyle(document.documentElement).getPropertyValue('--A');
            break;
        case 'B': 
            rank.style.color = getComputedStyle(document.documentElement).getPropertyValue('--B');
            break;
        case 'C': 
            rank.style.color = getComputedStyle(document.documentElement).getPropertyValue('--C');
            break;
        default: 
            rank.style.color = getComputedStyle(document.documentElement).getPropertyValue('--D');
    }

    if(rank.innerHTML != tempRank){
        rank.innerHTML = tempRank;
    }
    if (tempMods != data.menu.mods.str) {
        tempMods = data.menu.mods.str;
        tempMods = tempMods.replace('NM','');
        mods.innerHTML = tempMods;
    } 
    if (tempTitle != data.menu.bm.metadata.title) {
        tempTitle = data.menu.bm.metadata.title;
        title.innerHTML = tempTitle;
    }
    if (tempArtist != data.menu.bm.metadata.artist) {
        tempArtist = data.menu.bm.metadata.artist;
        artist.innerHTML = tempArtist;
    }
}