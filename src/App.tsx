import React, { useEffect, useRef, useState } from 'react';
import useInterval from './useInterval';
import Dino from "./assets/standingDino.png"
import LeftDino from "./assets/leftDino.png"
import RightDino from "./assets/rightDino.png"
import ClickIcon from "./assets/clickIcon.png"
import Ground from "./assets/midground.png"
import Tree from "./assets/cactus.png"
import GameOver from "./assets/gameOver.png"
import enterkey from "./assets/enterkey.png"
import key_up from "./assets/key_up.png"
import spacebar from "./assets/spacebar.png"
import r_key from "./assets/Rkey.png"
import jumpText from "./assets/jump.png"
import restartText from "./assets/restart.png"
import arrow from "./assets/arrow.png"
import './App.css';

// game variables

const refreshRate = 10
var runGameRate: number | null =  null
var moveIncrement = 50
const stepSlicer = 50000
const moveAcel = 5
var moveSpeed = (moveIncrement / stepSlicer) * (window.innerWidth / 100)
const DinoSize = 0.05
const maxTrees = 5
const jumpHight = 1.5
const minTreeDist = 3

var trees: number[]

//npx kill-port 3000

function App() {


	const canvasRef = useRef<HTMLCanvasElement | null>(null)
	const [gameOver, setGameOver] = useState(false)
	const [score, setScore] = useState(0)
	const [started, setStarted] = useState(false)
	const [jumped, setJumped] = useState<[boolean, number]>([false, 0])

	var groundImg = new Image(275, 29);
	groundImg.src = Ground
	groundImg.id = "ground"

	var TreeImg = new Image(25, 48);
	TreeImg.src = Tree
	TreeImg.id = "tree"

	var dinoImg = new Image(137, 147);
	dinoImg.src = Dino
	dinoImg.id = "dino"

	var leftDinoImg = new Image(113, 120);
	leftDinoImg.src = LeftDino
	leftDinoImg.id = "leftdino"

	var rightDinoImg = new Image(96, 104);
	rightDinoImg.src = RightDino
	rightDinoImg.id = "rightdino"

	var enterImg = new Image(500, 500);
	enterImg.src = enterkey
	enterImg.id = "enterkey"

	var keyUpImg = new Image(500, 500);
	keyUpImg.src = key_up
	keyUpImg.id = "key_up"

	var spacebarImg = new Image(272, 143);
	spacebarImg.src = spacebar
	spacebarImg.id = "spacebar"

	var rKeyImg = new Image(500, 500);
	rKeyImg.src = r_key
	rKeyImg.id = "rKey"

	var jumpTextImg = new Image(278, 101);
	jumpTextImg.src = jumpText
	jumpTextImg.id = "jumpText"

	var arrowImg = new Image(512, 512);
	arrowImg.src = arrow
	arrowImg.id = "arrow"


	var restartTextImg = new Image(327, 101);
	restartTextImg.src = restartText
	restartTextImg.id = "restartText"

	var overImg = new Image(666, 375);
	overImg.src = GameOver
	overImg.id = "over"

	var drawdinoImg = new Image

	let canvasX = window.innerWidth
	let canvasY = window.innerHeight
	let dinoX = Math.min(canvasX, canvasY * 2) * DinoSize
	let dinoY = Math.min(canvasX, canvasY * 2) * DinoSize

	let enterX = dinoX * 1.5
	let enterY = dinoX * 1.5

	let keyUpX = dinoX * 1.5
	let keyUpY = dinoX * 1.5

	let spaceX = dinoX * 3
	let spaceY = dinoX * 1.5

	let RX = dinoX * 1.5
	let RY = dinoX * 1.5

	let jumpTextX = dinoX * 3
	let jumpTextY = dinoX * 1.5

	let arrowX = dinoX * 3
	let arrowY = dinoX * 3

	let groundX = dinoX / 1.5
	let groundY = dinoY / 1.5

	let treeX = dinoX / 2
	let treeY = dinoY * 0.8

	let overX = Math.min(canvasX, canvasY * 2) / 3
	let overY = Math.min(canvasX, canvasY * 2) / 4

	let jumpTime = (dinoX + treeX) * 1.2 / moveSpeed

	useInterval(() => runGame(), runGameRate)
	useInterval(() => refresh(), refreshRate)

	function refresh() {
		if (!canvasRef.current) {
			return
		}
		const canvas = canvasRef.current
		const ctx = canvas.getContext("2d")
		if (!ctx) {
			return
		}

		//decide wich dino to draw
		if (jumped[0]) {
			if (score < Math.floor(jumped[1] + jumpTime / 2)) {
				drawdinoImg = leftDinoImg
			} else if (score > Math.floor(jumped[1] + jumpTime / 2)) {
				drawdinoImg = rightDinoImg
			}
		} else {
			drawdinoImg = dinoImg
		}

		//clears previous screen
		ctx.fillStyle = "#202124"
		ctx.clearRect(0, 0, canvasX, canvasY)
		ctx.fillRect(0, 0, canvasX, canvasY)
		ctx.fillStyle = "#202124"

		//draw game over screen
		if (gameOver) {
			ctx.drawImage(overImg, canvasX / 2 - overX / 2, canvasY / 2 - overY / 2, overX, overY)
			return
		}

		//draw instructions
		if (!started) {
			ctx.fillStyle = "#c3c9d4"
			ctx.clearRect(0, 0, canvasX, canvasY)
			ctx.fillRect(0, 0, canvasX, canvasY)
			ctx.drawImage(enterImg, canvasX / 2, dinoY, enterX, enterY)
			ctx.drawImage(keyUpImg, canvasX / 2 + enterX * 1.5, dinoY, keyUpX, keyUpY)
			ctx.drawImage(spacebarImg, canvasX / 2 + enterX * 1.5 + keyUpX * 1.5, dinoY, spaceX, spaceY)
			ctx.drawImage(rKeyImg, canvasX / 2, dinoY * 4, RX, RY)
			ctx.drawImage(jumpTextImg, canvasX / 2 - dinoX - jumpTextX, dinoY, jumpTextX, jumpTextY)
			ctx.drawImage(restartTextImg, canvasX / 2 - dinoX - jumpTextX, dinoY * 4, jumpTextX, jumpTextY)
			ctx.drawImage(arrowImg, canvasX / 2 - dinoX - jumpTextX - arrowX * 1.5, dinoY * 2, arrowX, arrowY)
        }

		//draw normal/jumping dino
		if (jumped[0]) {
			ctx.drawImage(drawdinoImg, Math.min(canvasX, canvasY) / 10, canvasY / 2 - dinoY / 2 - dinoY * jumpHight, dinoX, dinoY)
		} else {
			ctx.drawImage(drawdinoImg, Math.min(canvasX, canvasY) / 10, canvasY / 2 - dinoY / 2, dinoX, dinoY)
		}

		//draw ground
		if (started) {
			for (let i = 0; i < Math.ceil(canvasX / groundX); i++) {
				ctx.drawImage(groundImg, groundX * i, canvasY / 2 + dinoY / 2, groundX, groundY)
			}
		}
		
		//draw all trees

		if (trees) {
			trees.forEach((x) => ctx.drawImage(TreeImg, x, canvasY / 2 + dinoY / 2 - treeY, treeX, treeY))
			trees = trees.map((x) => (x - moveSpeed))
		}

		//reset jump to false

		if (score < Math.floor(jumped[1] + jumpTime*1.1) && score > Math.floor(jumped[1] + jumpTime*0.9)) {
			setJumped([false, 0])
		}

		//increment move speed

		moveIncrement += moveAcel
		moveSpeed = (moveIncrement / stepSlicer) * (window.innerWidth / 100)

    }

	//reset starting variables
	function start() {
		setStarted(true)
		setGameOver(false)
		setScore(0)
		moveIncrement = 25
		runGameRate = 10
		moveSpeed = (moveIncrement / stepSlicer) * (window.innerWidth / 100)
		setJumped([false,0])
		trees = []
	}

	//main run function
	function runGame() {
		newTree()
		treeCollision()
		setScore(score + 1)
    }

	//check for tree colisions
	function treeCollision() {
		if (trees) {
			for (let i = 0; i < trees.length; i++) {
				if (trees[i] > (Math.min(canvasX, canvasY) / 10) && trees[i] < (Math.min(canvasX, canvasY) / 10 + dinoX*4/5) && !jumped[0]) {
					handleSetScore()
					setGameOver(true)
					setStarted(false)
					runGameRate = null
				} else if (trees[i] < 0) { //remove tree if reaches the end
					trees.splice(i, 1)
				}
			}
        }
	}

	//create if needed a new tree
	function newTree() {
		let coordX = Math.floor(Math.random() * (canvasX / 2) + (canvasX / 2)) //create a random new tree coordinato, from mid screen to right end
		let treeNumb = Math.round(Math.random() * maxTrees) //generates a random number of trees on the field
		if (!trees || trees.length == 0) {//if there is no tree yet 
			trees = [coordX]
		} else if (trees.length < treeNumb && Math.abs(trees[trees.length - 1] - coordX) > (dinoX * minTreeDist)) {

			for (let i = 0; i < trees.length; i++) {
				if (trees.length < treeNumb && Math.abs(trees[i] - coordX) < (dinoX * minTreeDist)) {
					return //check for min distance betwen two trees
				}
			}
			trees[trees.length] = coordX

		}
    }
	
	function handleSetScore() {//store high score localy
		if (score > Number(localStorage.getItem("dinoScore"))) {
			localStorage.setItem("dinoScore", JSON.stringify(score))
		}
	}

	function input(e: React.KeyboardEvent<HTMLDivElement>) {
		switch (e.key) {
			case "Enter":
				setJumped([true, score])
				break
			case " ":
				setJumped([true, score])
				break
			case "ArrowUp":
				setJumped([true, score])
				break
			case "r":
				start()
				break
			case "ArrowDown":
				setJumped([false, 0])
				break
        }
	}

	function canvasClick() {//add functionality to mobile usage
		if (started) {
			setJumped([true, score])
		}
    }

	return (
		<div onKeyDown={(e) => input(e)}>
			<button className="button" onMouseDown={start} >
			  <div className="title"> <span>Dinossaur Game</span><img className="click" src={ClickIcon} />
			  </div>	
		  </button>
		  <div className="scoreBox">
			  <h2>Score: {score}</h2>
			  <h2>High Score: {localStorage.getItem("dinoScore")}</h2>
			</div>
			<canvas onClick={() => canvasClick()} ref={canvasRef} width={`${canvasX}px`} height={`${canvasY}px`} />
	  </div>
  );
}

export default App;