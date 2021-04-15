import * as seedrandom from 'seedrandom';
import { BaseRenderer } from './baseRenderer';
import gsap from 'gsap';

const WIDTH: number = 1920 / 2;
const HEIGHT: number = 1080 / 2;

let tl;

const srandom = seedrandom('b');

export default class CanvasRenderer implements BaseRenderer{

    colors = ['#74A588', '#D6CCAD', '#DC9C76', '#D6655A'];
    backgroundColor = '#42282F';
    items: any = [];
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    maxSize = 10;
    completeCallback: any;
    delta = 0;
    color = this.colors[0];

    constructor(canvas: HTMLCanvasElement) {
        
        canvas.width = WIDTH;
        canvas.height = HEIGHT;

        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        /// add items

        for (let i = 0; i < 1000; i++) {
            let x = srandom() * WIDTH;
            let y = srandom() * HEIGHT;
            let int = Math.floor(srandom() * this.colors.length);
            let color = this.colors[int];
            this.items.push({pos: {x, y}, color});
        }

        /// end add items

        this.reset();
        this.createTimeline();
    }

    private reset() {
        this.ctx.save();
        this.ctx.fillStyle = this.backgroundColor;
        this.ctx.fillRect(0, 0, WIDTH, HEIGHT);
        this.ctx.restore();
    }

    public render() {
        this.delta ++;

        /*
        this.ctx.save();
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(0, 0, WIDTH, HEIGHT);
        this.ctx.restore();
        */

        for (let i = this.items.length - 1; i > -1; i--) {
            this.ctx.save();
            this.ctx.beginPath();

            let item = this.items[i];
            let x = item.pos.x;
            let y = item.pos.y;
            this.ctx.fillStyle = item.color;

            this.ctx.arc(x, y, 5, 0, 2 * Math.PI);
            this.ctx.closePath();
            this.ctx.fill();
            this.ctx.restore();
        }

    }

    private createTimeline() {
        
        tl = gsap.timeline({
            repeat: -1,
            //yoyo: true,
            onComplete: () => this.handleComplete(),
            onRepeat: () => this.handleRepeat()
        });

        tl.timeScale(5);

        const duration = 10;

        for (let j = 0; j < 500; j++) {
            for (let i = 0; i < this.items.length; i++) {
                let item = this.items[i];

                let dist = 4;
                tl.set(item.pos, {
                    x: `+=${-(dist / 2) + srandom() * dist}`,
                    y: `+=${-(dist / 2) + srandom() * dist}`
                }, j / duration)
            }
        }

        tl.to(this, {
            color: this.delta,
            duration: duration,
            ease: 'none'
        }, 0);
                
        console.log('DURATION:', tl.duration());
        
    }

    protected handleRepeat() {

        if (this.completeCallback) {
            this.completeCallback();
        }

        this.reset();
    }

    protected handleComplete() {

    }

    public play() {
        this.reset();
        tl.restart();
    }

    public stop() {
        this.reset();
        tl.pause(true);
        tl.time(0);
    }

    public setCompleteCallback(completeCallback: any) {
        this.completeCallback = completeCallback;
    }

    randomX(i: number) {
        return (WIDTH / 2) + Math.sin(i) * ( 50 * srandom());
    }

    randomY(i: number) {
        return (WIDTH / 2) + Math.sin(i) * ( 50 * srandom());
    }
}