console.log('哈哈');

const dom =document.createElement("div")
dom.innerText="hello world!"

document.querySelector("#root").append(dom)

let i=0
while(i<1000000000){
	i++
}
