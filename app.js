// elements
const wordsEl = $(".words")
const inputBox = $("#inputBox")
const playAudioIcon = $("#playaudio > i")

// consts
const numWords = 10
const words = getWords(numWords)
const wordsData = []

// vars
let numCharsCorrectlyTyped = 0
let totalCharsTyped = 0
let isDone = false
let startDate
let typeSound = new Howl({ src: ['press.wav'] })
let currSoundIndex = 0
let playAudio = true

main()

function main() {
    words.forEach((word, i) => {
        wordsData.push({
            isActive: i == 0,
            isError: false,
            isCurrentlyError: false,
            wordString: word
        })
    })
    wordsData.forEach(word => {
        wordsEl.append($('<div class="word"></div>').text(word.wordString))
    })
    updateUI()

    inputBox.keydown(() => {
        if (playAudio)
            typeSound.play();
    })

    inputBox.keyup(e => {
        console.log(e.key);
        if (e.key == ' ' || (/[a-zA-Z]/.test(e.key) && e.key.length < 2)) { // is letter or space
            if (!startDate) startDate = new Date()
            totalCharsTyped++
            console.log("asdf");
        }

        const activeWord = getActiveWord()
        const activeWordIndex = wordsData.indexOf(activeWord)
        console.log(activeWord.wordString);
        console.log(inputBox.val());
        wordsData[activeWordIndex].isCurrentlyError = !activeWord.wordString.startsWith(inputBox.val())
        if (inputBox.val().includes(" ") && activeWord != undefined) {
            if (inputBox.val() != activeWord.wordString + " ") {
                activeWord.isError = true
            } else {
                numCharsCorrectlyTyped += activeWord.wordString.length + 1
            }
            if (activeWordIndex == wordsData.length - 1) {
                console.log("done");
                isDone = true
            }
            wordsData[activeWordIndex].isActive = false
            wordsData[activeWordIndex].isCurrentlyError = false
            inputBox.val("")
            if (activeWordIndex != wordsData.length - 1) {
                wordsData[activeWordIndex + 1].isActive = true
            }
        }
        if (activeWordIndex == wordsData.length - 1 && inputBox.val() == activeWord.wordString) {
            numCharsCorrectlyTyped += activeWord.wordString.length
            setTimeout(() => {
                wordsData[activeWordIndex].isActive = false
                wordsData[activeWordIndex].isCurrentlyError = false
                isDone = true
                updateUI()
            }, 300)
        }
        updateUI()
    })

    $('#playaudio').on('click', () => {
        playAudio = !playAudio
        updateUI()
    })
}

function getActiveWord() {
    return wordsData.find(word => word.isActive)
}

function getWpm() {
    const difference = new Date() - startDate
    const minsPassed = (difference / 1000) / 60
    return (numCharsCorrectlyTyped / 5) / minsPassed
}

function getWords(num) {
    const result = []
    for (let i = 0; i < num; i++) {
        let toAdd
        do toAdd = commonWords[Math.floor(Math.random() * commonWords.length)]
        while (result.includes(toAdd))
        result.push(toAdd)
    }
    return result
}

function updateUI() {
    wordsEl.children().each(function (i) {
        const word = wordsData[i]
        const wordEl = $(this)
        wordEl.applyClass('active', word.isActive)
        wordEl.applyClass('error', word.isError)
        wordEl.applyClass('currentlyError', word.isCurrentlyError)
        wordEl.text(word.wordString)
    })
    if (isDone) {
        $(".typingArea").css('display', 'none')
        $(".result").css('display', 'flex').html(`
            <div>${Math.floor(getWpm())} WPM</div>
            <div>${Math.floor(((numCharsCorrectlyTyped) / totalCharsTyped) * 100)}% accuracy</div>
            <button id="newtest">New test (Tab+Enter)</button>
        `)
        $("#newtest").on("click", () => {
            window.location.reload()
        })
    }

    if (playAudio) {
        playAudioIcon
            .addClass('fa-volume-high')
            .removeClass('fa-volume-xmark')
    } else {
        playAudioIcon
            .removeClass('fa-volume-high')
            .addClass('fa-volume-xmark')
    }
    // console.log(numCharsCorrectlyTyped);
}