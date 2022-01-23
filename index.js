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

//let k1 = document.getElementById('key1');
//let k2 = document.getElementById('key2');
//let difficulty = document.getElementById('difficulty');
let widthBase = scoreColor.offsetWidth;





//score.innerHTML = '0'.padStart(8,"0")

socket.onopen = () => {
    console.log("Successfully Connected");
};

socket.onclose = event => {
    console.log("Socket Closed Connection: ", event);
    socket.send("Client Closed!")
};

socket.onerror = error => {
    console.log("Socket Error: ", error);
};


let animation = {
    acc:  new CountUp('accdata', 0, 0, 2, .2, {useEasing: true, useGrouping: true,   separator: " ", decimal: "." }),
    combo:  new CountUp('combodata', 0, 0, 0, .2, {useEasing: true, useGrouping: true,   separator: "", decimal: "." }),
    comboshadow:  new CountUp('comboshadowdata', 0, 0, 0, .2, {useEasing: true, useGrouping: true,   separator: "", decimal: "." }),
    score: new CountUp('scoredata', 0, 0, 0, .5, {useEasing: true, useGrouping: true,   separator: "", decimal: ".", formattingFn: (n) => {
    return n.toString().padStart(8,"0");
	} }),
    pp: new CountUp('pp', 0, 0, 0, .2, {useEasing: true, useGrouping: true,   separator: " ", decimal: "." }),
    h100: new CountUp('h100', 0, 0, 0, .2, {useEasing: true, useGrouping: true,   separator: " ", decimal: "." }),
    h50: new CountUp('h50', 0, 0, 0, .2, {useEasing: true, useGrouping: true,   separator: " ", decimal: "." }),
    h0: new CountUp('h0', 0, 0, 0, .2, {useEasing: true, useGrouping: true,   separator: " ", decimal: "." }),
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
//let tempK1;
//let tempk2;
//let tempDifficulty;

socket.onmessage = event => {  
    let data = JSON.parse(event.data);
    if(tempState !== data.menu.state || tempShowInterface !== data.settings.showInterface){
        tempState = data.menu.state;
        tempShowInterface = data.settings.showInterface;
        if(tempState == 2 && tempShowInterface == 0){
            wrapper.style.opacity = 1;
        }
        else{
            wrapper.style.opacity = 0;
        }
    }

    if(data.gameplay.hp.normal != "" || data.gameplay.hp.normal != null || data.gameplay.hp.normal != undefined){
        let step = widthBase/200;
        scoreColor.style.width = step * data.gameplay.hp.normal +'px'
    }
    if(data.gameplay.score != ""){
    	animation.score.update(data.gameplay.score)
    } else {
    	animation.score.update(0)
    }
    if(data.gameplay.accuracy != "" && data.gameplay.accuracy >= 0 && data.gameplay.accuracy <= 100){
        animation.acc.update(data.gameplay.accuracy)
    } else {
    	animation.acc.update(100)
    }
    if(data.gameplay.pp.current != "") {
        animation.pp.update(data.gameplay.pp.current)
    } else {
        animation.pp.update(0)
    }
    if(tempPP != data.gameplay.pp.maxThisPlay) {
        tempPP = data.gameplay.pp.maxThisPlay
        ppmax.innerHTML = tempPP
    }
    if(data.gameplay.hits[100] != "") {
        animation.h100.update(data.gameplay.hits[100]);
    } else {
        animation.h100.update(0)
    }
    if(data.gameplay.hits[50] != "") {
        animation.h50.update(data.gameplay.hits[50]);
    } else {
        animation.h50.update(0)
    }
    if(data.gameplay.hits[0] != "") {
        animation.h0.update(data.gameplay.hits[0]);
    } else {
        animation.h0.update(0)
    }
    if(data.gameplay.combo.current != ""){
    	if(tempCombo !== data.gameplay.combo.current) {
    		tempCombo = data.gameplay.combo.current;
			animation.comboshadow.update(tempCombo)
    		animation.combo.update(tempCombo)
    		
    		combo.classList.remove('combo-scale');
    		comboShadow.classList.remove('comboShadow-scale');
    		void combo.offsetWidth;
    		void comboShadow.offsetWidth;
    		combo.classList.add('combo-scale');
    		comboShadow.classList.add('comboShadow-scale');

    	}
    } else {
    	animation.combo.update(0)
    	animation.comboshadow.update(0)
    }
    if(tempTime !== data.menu.bm.time.current || tempTimeMax !== data.menu.bm.time.full) {
        tempTime = data.menu.bm.time.current;
        if(tempTimeMax !== data.menu.bm.time.full) {
            tempTimeMax = data.menu.bm.time.full;
        }
        time = (tempTime / tempTimeMax) * 100;
        timeString = time.toString();
        style = "conic-gradient(#999999 " + timeString + "%, rgba(0,0,0,0) 0)";
        timer.style.background = style;
    }
    if (data.menu.mods.str.includes("HD") || data.menu.mods.str.includes("FL")) {
      hdfl = true;
    } else hdfl = false;
    if (data.gameplay.hits.grade.current === "") {
      tempRank = 'SS'
    } else tempRank = data.gameplay.hits.grade.current

    if (tempRank == 'SS'){
      if (hdfl == true) {
        rank.style.color = getComputedStyle(document.documentElement).getPropertyValue('--SHD');
      } else {
        rank.style.color = getComputedStyle(document.documentElement).getPropertyValue('--S');
      }
    } else if (tempRank == 'S'){
      if (hdfl == true) {
        rank.style.color = getComputedStyle(document.documentElement).getPropertyValue('--SHD');
      } else {
        rank.style.color = getComputedStyle(document.documentElement).getPropertyValue('--S');
      }
    } else if (tempRank == 'A'){
      rank.style.color = getComputedStyle(document.documentElement).getPropertyValue('--A');
    } else if (tempRank == 'B'){
      rank.style.color = getComputedStyle(document.documentElement).getPropertyValue('--B');
    } else if (tempRank == 'C'){
      rank.style.color = getComputedStyle(document.documentElement).getPropertyValue('--C');
    } else {
      rank.style.color = getComputedStyle(document.documentElement).getPropertyValue('--D');
    } 
    
    if(rank.innerHTML != tempRank){
        rank.innerHTML = tempRank;
    }

    if (tempMods != data.menu.mods.str) {
        tempMods = data.menu.mods.str
        tempMods = tempMods.replace('NM','');
        mods.innerHTML = tempMods
    } 
    if (tempTitle != data.menu.bm.metadata.title) {
        tempTitle = data.menu.bm.metadata.title
        title.innerHTML = tempTitle
    }
    if (tempArtist != data.menu.bm.metadata.artist) {
        tempArtist = data.menu.bm.metadata.artist
        artist.innerHTML = tempArtist
    }
    /*if (tempDifficulty != data.menu.bm.metadata.difficulty) {
        tempDifficulty = data.menu.bm.metadata.difficulty
        difficulty.innerHTML = '[' + tempDifficulty + ']' + data.menu.bm.stats.BPM.max + ' BPM'
    }*/

    /*
    if (data.gameplay.keyOverlay.k1.isPressed) {
        k1.style.background = "rgb(65,184,131)"
        k1.style.right = "8px"
        k1.style.top = "605px"
        k1.height = "40px"
    } else {
        k1.style.background = "white"
        k1.style.right = "5px"
        k1.style.top = "600px"
        k1.style.height = "50px"

    }
    if (data.gameplay.keyOverlay.k2.isPressed) {
        k2.style.background = "rgb(65,184,131)"
        k2.style.right = "8px"
        k2.style.top = "665px"
        k2.height = "40px"
    } else {
        k2.style.background = "white"
        k2.style.right = "5px"
        k2.style.top = "660px"
        k2.style.height = "50px"

    }*/

}