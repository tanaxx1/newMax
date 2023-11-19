const question = document.querySelector('.question')
const chat = document.querySelector('.chat-section')
const place = document.querySelector('.place-holder')
const questionInput = document.querySelector('.question input')
const apiKey = "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";

let prompt = ''
question.addEventListener('submit', async (e) => {
  e.preventDefault()
  place.style.display = 'none'
  let html2 = `<div class="user chat">
  <p>${questionInput.value}</p>
  <span><i class="fa-solid fa-user"></i></span>
 </div>`
chat.innerHTML += html2
  prompt = questionInput.value
  console.log(prompt);
  const res = await askOpenAi()
  console.log(res.choices[0].message.content);

  let html = `<div class="system chat">
            <span><i class="fa-solid fa-robot"></i></span>
            <p>${res.choices[0].message.content}</p>
            </div>`
 
  chat.innerHTML += html

})


const askOpenAi = async () => {
  return fetch('https://api.openai.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`,
  },
  body: JSON.stringify({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: 'You are a helpful assistant.',
      },
      {
        role: 'user',
        content: prompt
      }
    ],
  }),
})
  .then(response => response.json())
  .then(data => {
    return data
  });
}

const result = async () => {
  
}

result()
