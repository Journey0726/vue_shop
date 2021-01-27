module.exports = {
    configureWebpack:{
        //别名
        resolve:{
            alias:{
                'assets':'@/assets',
                'common':'@/common',
                'components':'@/components',
                'network':'@/network',
                'views':'@/views',
            }
        }
    },
    chainWebpack:config =>{
        config.when(process.env.NODE_ENV === 'production',config=>{
            config.entry('app').clear().add('./src/main-prod.js')
        })
        config.when(process.env.NODE_ENV === 'development',config=>{
            config.entry('app').clear().add('./src/main-dev.js')
        })
    }
}