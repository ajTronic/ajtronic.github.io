// accuracy => num words correct / num words total

1// elements
const wordsEl = $(".words")
const inputBox = $("#inputBox")
const playAudioIcon = $("#playaudio > i")

// consts
const numWords = 30
const words = getWords(numWords)
const wordsData = []

let numCharsCorrectlyTyped = 0
let totalCharsTyped = 0
// vars
let numWordsTyped = 0
let numWordsCorrectlyTyped = 0
let isDone = false
let startDate
let endDate
let typeSound = new Howl({ src: ['press.wav'] })
let currSoundIndex = 0
let playAudio = true
let activeWordIndex = 0

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

    inputBox.bind('input', e => {
        if (!startDate) startDate = new Date()

        const val = $(inputBox).val()
        const activeWord = wordsData[activeWordIndex]
        activeWord.isActive = true
        activeWord.isCurrentlyError = !activeWord.wordString.startsWith(val)

        // last word was correct
        if (activeWordIndex == wordsData.length - 1 && val == activeWord.wordString) {
            endDate = new Date()
            numWordsCorrectlyTyped++

            // slight delay
            setTimeout(() => {
                isDone = true
                updateUI()
            }, 300)
           
        } else if (val.at(-1) == " ") {  // pressed space
            inputBox.val("") // clear input

            if (val == activeWord.wordString + " ") numWordsCorrectlyTyped++ // was correct
            else activeWord.isError = true // was wrong

            nextWord()
        }

        // account for all the changes
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
    const difference = endDate - startDate
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

function nextWord() {
    const activeWord = wordsData[activeWordIndex]
    activeWord.isActive = false
    activeWord.isCurrentlyError = false
    wordsData[++activeWordIndex].isActive = true
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
        console.log(numWordsCorrectlyTyped);
        $(".typingArea").css('display', 'none')
        $(".result").css('display', 'flex').html(`
            <div>${Math.floor(getWpm())} WPM</div>
            <div>${Math.floor(((numWordsCorrectlyTyped) / words.length) * 100)}% accuracy</div>
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