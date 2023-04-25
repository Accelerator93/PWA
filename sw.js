

const cache_estatico = 'staticV1';
const cache_dinamico = 'dinamicV1';
const cache_inmutable = 'inmutableV1';

self.addEventListener('install', e => {

    const cacheInstallEstatico = caches.open(cache_estatico).then(cache => {

        return cache.addAll([
            '/',
            '/index.html',
            '/manifest.json',
            'Champs.html?campeon=${nombrecamp}&imagen=${imagenSrc}&descripcion=${DescCampeon[descamp].descripcion}',
            '/Champs.html',
            '/css/style.css',
            'pages/Offline.html',
            '/js/app.js',
            //imagenes de pagina
            '/img/SC.ico',
            '/img/icono.ico',
            '/img/Fondo.png',
            '/img/LOL.jpeg',
            '/img/No-image.png',
            '/img/offline.jpg',
            '/img/P.jpg',
            //imagenes de Ahri
            '/img/Ahri/Ahri.jpg',
            '/img/Ahri/Aquelarre.jpg',
            '/img/Ahri/Aspirante.jpg',
            // imagenes de Annie
            '/img/Annie/Annie.jpg',
            
            '/img/Annie/Gotica.jpg',
            '/img/Annie/SuperGalactica.jpg',
            // imagenes de Brand
            '/img/Brand/Brand.jpg',
            '/img/Brand/FuegoEspiritual.jpg',
            '/img/Brand/Zombie.jpg',
            //imagenes de Kaisa
            '/img/Kaisa/Kaisa.jpg',
            '/img/Kaisa/GuardianaEstelar.jpg',
            '/img/Kaisa/KDA.jpg',
            //imagenes de Katarina
            '/img/Katarina/Katarina.jpg',
            '/img/Katarina/Mercenaria.jpg',
            '/img/Katarina/Minina.jpg',
            //imagenes de MissFortune
            '/img/MissFortune/Missfortune.jpg',
            '/img/MissFortune/AgenteSecreta.jpg',
            '/img/MissFortune/GatilleraGalactica.jpg',
            //imagenes de Sona
            '/img/Sona/Sona.jpg',
            '/img/Sona/DJ.jpg',
            '/img/Sona/Odisea.jpg'
        ]);

    })
    const cacheInstallimutable= caches.open(cache_inmutable).then(cache=>{

        return cache.add('https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css')
       })
        e.waitUntil(Promise.all([cacheInstallEstatico,cacheInstallimutable]));
    });
   

 self.addEventListener('fetch', e=>{

    const respuesta = new Promise((resolve, reject)=>{

        let rechazada = false;
        const falloUnaVez = ()=>{
         if(rechazada){ 
            if(/\.(png|jpg)$/i.test(e.request.url)){
                resolve(caches.match('img/No-Image.png'));
            }
            else{
                reject('No se encontro respuesta')
            }
        }
        else{
            rechazada = true;

        }

    };
    fetch(e.request).then(res =>{
        res.ok? resolve(res): falloUnaVez();

    }).catch(falloUnaVez);

    caches.match(e.request).then(res=>{
        res? resolve(res):falloUnaVez();

        const respuesta = fetch (e.request).then(res=>{

            console.log('fetch',res);
            caches.open(cache_dinamico).then(cache=>{
            cache.put(e.request, res);

            })
            return res.clone();
        }).catch(err=>{
            if(e.request.headers.get('accept').includes('text/html')){
                return caches.match('pages/Offline.html');
            }
        })

    }).catch(falloUnaVez);
}).catch(err=>{
    if(e.request.headers.get('accept').includes('text/html')){
        return caches.match('pages/Offline.html');
    }
})
e.respondWith(respuesta);
})
