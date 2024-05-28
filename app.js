class DrumKit {
    constructor() {
        this.pads = document.querySelectorAll('.pad');
        this.playButton = document.querySelector('.play');
        this.currentKick = './allSounds/kick-classic.wav';
        this.currentSnare = './allSounds/snare-acoustic01.wav';
        this.currentHihat = './allSounds/hihat-acoustic01.wav';
        this.currentBass1 = './allSounds/bass12.flac';
        this.currentBass2 = './allSounds/bass15.flac';
        this.kickAudio = document.querySelector('.kick-sound');
        this.snareAudio = document.querySelector('.snare-sound');
        this.hihatAudio = document.querySelector('.hihat-sound');
        this.bass1Audio = document.querySelector('.bass1-sound');
        this.bass2Audio = document.querySelector('.bass2-sound');
        this.mutebtns = document.querySelectorAll('.mute');
        this.selects = document.querySelectorAll('select');
        this.tempoSlider = document.querySelector('.tempo-slider');
        this.volumeSlider = document.querySelector('.volume-slider');
        this.index = 0;
        this.bpm = 150;
        this.isPlaying = null;
    }
    //add the active class we created in style sheet
    activePad(){
        this.classList.toggle('active');
    }
    //repeater
    repeat(){
        //when we arrive to 8 and multiples the step will be 0
        let step = this.index % 16; 
        //select each pad based on the step number
        const activeBars = document.querySelectorAll(`.b${step}`);
        //loop over the pads
        activeBars.forEach(bar => {
            //2 makes it altenate back
            bar.style.animation = `playTrack 0.3s alternate ease-in-out 2`;
            // check if bar is active
            if (bar.classList.contains("active")){
                //check each sound
                if (bar.classList.contains("kick-pad")){
                    //set time of audio track to 0 so sample play always from beginning
                    this.kickAudio.currentTime = 0;
                    this.kickAudio.play();
                }
                if (bar.classList.contains("snare-pad")){
                    this.snareAudio.currentTime = 0;
                    this.snareAudio.play();
                }
                if (bar.classList.contains("hihat-pad")){
                    this.hihatAudio.currentTime = 0;
                    this.hihatAudio.play();
                }
                if (bar.classList.contains("bass1-pad")){
                    this.bass1Audio.currentTime = 0;
                    this.bass1Audio.play();
                    console.log(this.bassAudio);
                }
                if (bar.classList.contains("bass2-pad")){
                    this.bass2Audio.currentTime = 0;
                    this.bass2Audio.play();
                    console.log(this.bassAudio);
                }

            }
        });
        this.index++;
    }

    //now let's run the reapet method multiple times
    start(){
        //bpm in millisecond
        const interval = (60000/this.bpm);
        //use arrow functio so we can can use 'this'
        //setInterval generats an ID which I can use to stop it
        //!this.isPlaying return TRUE: it's not playing = true

        //being set null it 's flase and else run, setting the interval
        //I clikc again and it is playing so it if returns true. stop the interval
        if (this.isPlaying) {
            clearInterval(this.isPlaying);
            //and re set it to null
            this.isPlaying = null;
            this.playButton.innerText = ('Play');
            this.playButton.classList.remove('active');
            
        } else {
            //set isPlaying to the interval ID and it runs
            this.isPlaying = setInterval(()=> {
                this.repeat();
            }, interval);
            this.playButton.innerText = ('Stop');
            this.playButton.classList.add('active');    
        }
    }

    //it only updates what's shown in the slider
    changeTempo(e){
        const tempoText = document.querySelector('.tempo-nr');
        tempoText.innerText = e.target.value;
    }

    changeVolume(e){
        const levels = document.querySelectorAll('audio');
        levels.forEach(level =>{
            level.volume = e.target.value;
        })
        const volumeText = document.querySelector('.volume-nr');
        volumeText.innerText = `${e.target.value*100}%`;
    }

    updateTempo(e){
        //update bpm with the  on 'change' event value
        this.bpm = e.target.value;

        //"stop" it in order to clear the interval and re addit again updated
        clearInterval(this.isPlaying);
        this.isPlaying = null;

        //re start it if it was playing
        const playBtn = this.playButton
        if (playBtn.classList.contains('active')){
            this.start();
        }
    }

    changeSound(e) {
        const selectionName = e.target.name;
        const selectionValue = e.target.value;
        console.log(selectionValue);
        switch(selectionName){
            case "kick-select": 
            this.kickAudio.src =  selectionValue;
            break;
            case "snare-select": 
            this.snareAudio.src =  selectionValue;
            break;
            case "hihat-select": 
            this.hihatAudio.src =  selectionValue;
            break;
        }
    }

    mute(e){
        const muteIndex = e.target.getAttribute('data-track');
        e.target.classList.toggle('active');
        if (e.target.classList.contains('active')){
            switch(muteIndex){
                case "0": 
                this.kickAudio.volume = 0;
                break;
                case "1": 
                this.snareAudio.volume = 0;
                break;
                case "2": 
                this.hihatAudio.volume = 0;
                break;
            }
        } else {
            switch(muteIndex){
                case "0": 
                this.kickAudio.volume = 1;
                break;

                case "1": 
                this.snareAudio.volume = 1;
                break;

                case "2": 
                this.hihatAudio.volume = 1;
                break;
            }
        }
    }
}


const drumkit = new DrumKit();


//EVENT LISTENERS 

//add animation to pads
//when I click on a pad, add the active class
drumkit.pads.forEach(pad => {
    pad.addEventListener('click', drumkit.activePad);
    //remove animation once finished so it start again
    pad.addEventListener('animationend', function() {
        this.style.animation = "";
    })
});

//play and stop
//when using event listeners, invoice method in a callback function
drumkit.playButton.addEventListener('click', function() {
    drumkit.start();
});

//Change Tempo
//input is going to create many event everytime is moved.
//We use it to change the text of tempo
drumkit.tempoSlider.addEventListener('input', function(e){
    drumkit.changeTempo(e);
})

//we use the final value for updating the bpm / interval
drumkit.tempoSlider.addEventListener('change', function(e){
    drumkit.updateTempo(e);
})

//Change Volume
drumkit.volumeSlider.addEventListener('input', function(e){
    drumkit.changeVolume(e);
})


//select sounds
drumkit.selects.forEach(select =>{
    select.addEventListener('change', function (e) {
        drumkit.changeSound(e);
    });
});

// mute sounds
drumkit.mutebtns.forEach(btn => {
    btn.addEventListener('click', function(e){
        drumkit.mute(e);
    });
});


