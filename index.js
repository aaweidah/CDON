const imageGrid = document.querySelector(".image-grid1")
const loading = document.querySelector(".loading")
const closeButton = document.querySelector(".closeButton")
let fetchingImages = false
let images = null

var throttleTime
const throttle = (callBack, time) => {
    if (throttleTime) {
        return
    }
    throttleTime = true
    setTimeout(() => {
        callBack()
        throttleTime = false
    }, time);
}

function fetchImages() {
    fetchingImages = true
    return Promise.all(Array(25).fill({}).map(() => {
        loading.classList.add("active")
        return fetch("https://api.giphy.com/v1/stickers/random?api_key=P3wOVHP4KNx4VH6JMJs3Bs0KFxv39pqI&tag=&offset=0&limit=20")
            .then(res => res.json())
    })).then(responses => {
        loading.classList.remove("active")
        fetchingImages = false
        return responses
    })
}

function handleInfiniteScroll() {
    const images = document.querySelectorAll(".image-grid1 img")
    const isSelectedImage = [...images].some(img => img.className.includes("selected-image-style"))
    if (!isSelectedImage){
        throttle(() => {
            var endOfPage = window.innerHeight + window.pageYOffset >= document.body.offsetHeight
            if (endOfPage) {
                renderImages()
            }
            var scrollY = document.scrollHeight - document.scrollTop;
            var height = document.offsetHeight;
            var offset = height - scrollY;
    
            if (offset == 0 || offset == 1) {
                console.log("test")
            }
        }, 1000)
    }     
}

window.addEventListener("scroll", handleInfiniteScroll)

closeButton.addEventListener("click", (e) => {
    e.target.classList.remove("active")
    const images = document.querySelectorAll(".image-grid1 img")
    images.forEach(img =>{
        img.className = ""
        img.classList.add("image-grid-img")
    })
})

async function renderImages() {
    images = await fetchImages()
    images.map((image) => {
        const imageElement = document.createElement("img")
        imageElement.src = `https://i.giphy.com/media/${image.data.id}/giphy.webp`
        imageElement.alt = "art"
        imageElement.classList.add("image-grid-img")
        imageElement.addEventListener("click", (e) => {
            if (!fetchingImages) {
                const images = document.querySelectorAll(".image-grid1 img")
            e.target.classList.remove("image-grid-img")
            images.forEach(img =>{
                img.className = ""
                img.classList.add("image-grid-img")
                if (img != e.target) {
                    img.classList.add("hidden")
                    e.target.classList.remove("image-grid-img")
                    e.target.classList.add("selected-image-style")
                    closeButton.classList.add("active")
                }
                if (e.target.previousElementSibling) {
                    e.target.previousElementSibling.classList.remove("hidden")
                    e.target.previousElementSibling.classList.add("previous-image")
                    e.target.previousElementSibling.classList.remove("image-grid-img")
                }
                if (e.target.nextElementSibling) {
                    e.target.nextElementSibling.classList.remove("hidden")
                    e.target.nextElementSibling.classList.add("next-image")
                    e.target.nextElementSibling.classList.remove("image-grid-img")
                }
            })
            }
        })
        imageGrid.appendChild(imageElement)
    })
}

renderImages()