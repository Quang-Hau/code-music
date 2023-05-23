const $$ = document.querySelectorAll.bind(document);
const $ = document.querySelector.bind(document);

const PLAYER_STORAGE_KEY = 'music player'

const heading = $('.header h2')
const cdThumb = $('.cd-thumb')
const thumb = $('.thumb')
const audio = $('#audio')
const cd = $('.cd')
const playBtn = $('.btn-toggle-play')
const player = $('.player')
const progress = $('#progress')
const nextBtn  = $('.btn-next')
const prevBtn  = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist = $('.playlist')


const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    isThumd: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {}
    ,
    songs: [
        {
            name: 'và ngày nào đó',
            singer:'Trung quân idol',
            path:'assets/list-songs/VaNgayNaoDo1-TrungQuanIdol-7861301-song-1.mp3',
            image:'assets/list-image-songs/img-song-1.jpg'
        },
        {
            name: 'cuối cùng thì',
            singer:'Jack',
            path:'assets/list-songs/CuoiCungThiLive-JackJ97-8462806-song-2.mp3',
            image:'assets/list-image-songs/img-song-2.jpg'
        },
        {
            name: 'pháo hồng',
            singer:'Đạt Long Vinh',
            path:'assets/list-songs/PhaoHong-DatLongVinh-7582920.mp3',
            image:'assets/list-image-songs/img-song-3.jpg'
        },
        {
            name: 'đưng quên tên anh',
            singer:'Hoa Vinh',
            path:'assets/list-songs/DungQuenTenAnh-HoaVinhDatG-5880115 -4.mp3',
            image:'assets/list-image-songs/img-song-4.jpg'
        },
        {
            name: 'ngàn yêu thương về đâu',
            singer:'Huy Vạc',
            path:'assets/list-songs/NganYeuThuongVeDauOrinnRemix-HuyVac-6984876-5.mp3',
            image:'assets/list-image-songs/img-song-5.jpg'
        },
        {
            name: 'ngôi sao cô đơn',
            singer:'Jack',
            path:'assets/list-songs/NgoiSaoCoDon-JackJ97-7611601-6.mp3',
            image:'assets/list-image-songs/img-song-6.jpg'
        },
        {
            name: 'yêu dại khờ',
            singer:'low Hoàng',
            path:'assets/list-songs/YeuEmDaiKhoKingsleyMashup-LouHoang-6038941-7.mp3',
            image:'assets/list-image-songs/img-song-7.jpg'
        },
        {
            name: 'như phút ban đầu',
            singer:'Noo Phước Thịnh',
            path:'assets/list-songs/NhuPhutBanDau-NooPhuocThinh-6458668-8.mp3',
            image:'assets/list-image-songs/img-song-8.jpg'
        },
        {
            name: 'sợ ngày mai em đi mất',
            singer:'Đạt G',
            path:'assets/list-songs/NgayMaiEmDiMatLiveVersion-KhaiDangDatG-7827483-9.mp3',
            image:'assets/list-image-songs/img-song-9.jpg'
        },
        {
            name: 'hồng kong1',
            singer:'Nguyền Thành Tài',
            path:'assets/list-songs/Hongkong1RnbVersion-NguyenTrongTaiSanJi-5764622-9.mp3',
            image:'assets/list-image-songs/img-song-10.jpg'
        },
    ],
    setConfig: function(key,value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY ,JSON.stringify(this.config));
    },
    render: function() {
        const htmls = this.songs.map((song,index) => {
            return `
            <div class="song ${index === this.currentIndex ? 'active' : ''} " data-index="${index}">
            <div class="thumb" style="background-image: url('${song.image}')">
            </div>
            <div class="body">
              <h3 class="title">${song.name}</h3>
              <p class="author">${song.singer}</p>
            </div>
            <div class="option">
              <i class="fas fa-ellipsis-h"></i>
            </div>
          </div>
            `
        })
        $('.playlist').innerHTML = htmls.join('')
    },

    defineProperties: function() {
        Object.defineProperty(this,'currentSong', {

            get: function() {
                return this.songs[this.currentIndex]
            }
        })
    },

    handleEvents: function() {
        const _this = this
        const cdWidth = cd.offsetWidth
        // xủ lí cd quay và dừng
        const cdThumbAnimate = cdThumb.animate([
            {transform: 'rotate(360deg)'}
        ], {
            duration: 10000, // quay 1000 s
            iterations: Infinity // quay vô hạn
        })
        cdThumbAnimate.pause()
        //xử lí phóng to thu nhỏ cd
        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0

            cd.style.opacity = newCdWidth / cdWidth
        }

        //xủ lí khi click play
        playBtn.onclick = function() {
            if( _this.isPlaying ) {
                audio.pause()
            }else {
                audio.play()
            }
        }

        // khi song được play
        audio.onplay = function() {
            _this.isPlaying = true
            _this.isThumd = true
            player.classList.add('playing')
            cdThumbAnimate.play()
        }
         // khi song pause 
         audio.onpause = function() {
            _this.isPlaying = false
            _this.isThumd = false
            player.classList.remove('playing')
            cdThumbAnimate.pause()

        }

        // khi tiến độ bài hat thay đổi
        audio.ontimeupdate = function() {
            if(audio.duration) {                         //currentTime trả về thời gian hiện tại bài hát khi dang play
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent                           //duration trả về thời gian tổng thời lượng của bài hát
            }
        }

        // sử lí khi tua song
                 // onchange khi có sự thay đổi diễn ra
        progress.onchange = function(e) {
            const seekTime = audio.duration / 100 * e.target.value
            audio.currentTime = seekTime 
        }   

        //xử lí next song
        nextBtn.onclick = function() {
            if(_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.nextSong()
            }
            audio.play()
            _this.render() 
            _this.scrollToActiveSong()
        }

         //xử lí prev song
         prevBtn.onclick = function() {
            if(_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.prevSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }

        // random song
        randomBtn.onclick = function() {           
            _this.isRandom = !_this.isRandom
            _this.setConfig('isRandom', !_this.isRandom)
            randomBtn.classList.toggle('active', _this.isRandom )
        }

        // xứ lí phát lại bài hát
        repeatBtn.onclick = function() {
            _this.isRepeat = !_this.isRepeat
            _this.setConfig('isRepeat', !_this.isRepeat)
            repeatBtn.classList.toggle('active',  _this.isRepeat )
        }

        // tự động qua bài khi hết nhạc
        audio.onended = function() {
            if(_this.isRepeat) {
                audio.play()
            }else{
                nextBtn.click() 
            }
        }
        // lắng nghe hành vi click vào playlist
        playlist.onclick = function(e) {
            const songElement = e.target.closest('.song:not(.active)')
            const optionElement = e.target.closest('.option')
            if(songElement || optionElement) {
                if(songElement) {
                   _this.currentIndex  = Number(songElement.getAttribute('data-index'))
                   _this.loadCurentSong()
                   _this.render()
                   audio.play()
                }

                if(optionElement) {
                    
                }
            }
        }
    },

    scrollToActiveSong: function() {
        setTimeout(() => {
            if( this.currentIndex === 0) {
                $('.song.active').scrollIntoView({
                    behavior : 'smooth',
                    block: 'end'
                })
            }else{
                $('.song.active').scrollIntoView({
                    behavior : 'smooth',
                    block: 'nearest'
                })
            }
        },300)
    },

    loadCurentSong: function() {
        heading.textConTent = this.currentSong.name
        cdThumb.style.backgroundImage = `url(${this.currentSong.image})`
        audio.src = this.currentSong.path
    },

    loadConfig: function() {
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
    },

    nextSong: function() {
        this.currentIndex++
         // xử lí phát lại bài hát khi list đến đầu 
        if(this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurentSong()
    },
    prevSong: function() {
        this.currentIndex--
        // xử lí phát lại bài hát khi list đến cuối 
        if(this.currentIndex < 0) {
            this.currentIndex = this.songs.length -1
        }
        this.loadCurentSong()
    },

    playRandomSong: function() {
        let newIndex;
        do {
          newIndex = Math.floor(Math.random() * this.songs.length);
        } while (newIndex === this.currentIndex);
    
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },
    start: function() {
        //gán cấu hình từ config vào ứng dụng
        this.loadConfig()
        
        //định nghĩa thuộc tính cho object
        this.defineProperties()

        // lắng nghr / sử lí sự kiện dom events
        this.handleEvents()

        //tait thông tin bài hát đâu tiên vap UI khi chạy
        this.loadCurentSong()

        //render playlist
        this.render()

        // hiển thì trạng thái ban đầu cảu btn repeat và random
        randomBtn.classList.toggle('active', this.isRandom )
        repeatBtn.classList.toggle('active',  this.isRepeat )
    },
}

app.start()