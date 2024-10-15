const config = {
    apiBaseUrl: process.env.API_BASE_URL || 'https://api.radapp.tech',
    url: 'https://radapp.tech',
    firebaseConfig: {
        apiKey: "AIzaSyB-cVs6wnLLHfpVBV5jC9pvESoqZ821rwo",
        authDomain: "radapp-88c57.firebaseapp.com",
        projectId: "radapp-88c57",
        storageBucket: "radapp-88c57.appspot.com",
        messagingSenderId: "574855561258",
        appId: "1:574855561258:web:4c6c3a30ef8bf406c00353",
        measurementId: "G-CMX61HT2GQ"
      },
    fcm: {
        vapidkey: 'BEsfD5AZNdJdr4_GW66tBGeRjHSjTNJfFsnkjxvSmE2Fs-FVG3aiELOdwi3nsaQrxhowgQz-U2n2VTyFGXUrugw'
    },
    hero: {
        videoUrl: "https://vmpn09wz4fdok1nr.public.blob.vercel-storage.com/earthTech-Q7oT0GmqwaQBOd6gnVc8V0xt0ElTCd.mp4"
    },
    isPlatformEnabled: process.env.IS_PLATFORM_ENABLED !== 'false'
}

export default config;