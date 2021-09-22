const {Airgram, Auth, prompt, toObject} = require('airgram');

const airgram = new Airgram({
    apiId: 1353431,
    apiHash: '01136b1cbb291035022663945b69d878',
    logVerbosityLevel: 2
})


airgram.use(new Auth({
    code: () => prompt(`Please enter the secret code:\n`),
    phoneNumber: () => prompt(`Please enter your phone number:\n`)
}))

let monitorChat;
let run;

async function listChats() {
    const chatsResponse = await airgram.api.getChats({
        limit: 10,
        offsetChatId: 0,
        offsetOrder: '9223372036854775807' // 2^63
    });
    const chatResponses = await Promise.all(chatsResponse.response.chatIds.map(id => {
        return airgram.api.getChat({chatId: id});
    }));
    const chats = chatResponses.map(chatResponse => chatResponse.response.title);
    chats.forEach((title, index) => {
        console.log(index + ' - ' + title);
    });
    const choice = await prompt(`Choose chat (0 - 9): `);
    run = require('./app').run;
    monitorChat = chatResponses[choice].response;
    console.log('Monitoring: ' + monitorChat.title);
};

async function tradeThisMazafaka(message) {
    console.log('Message: ' + message);
    run(message);
};

// Getting new messages
airgram.on('updateNewMessage', async ({update}, next) => {
    const {message} = update
    if(!monitorChat){
        listChats();
    }else if ( message.chatId == monitorChat.id) {
        tradeThisMazafaka(message.content.text.text);
    } 
    return next();
})
