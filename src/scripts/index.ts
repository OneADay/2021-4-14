import './index.less';


import BaseRecorder from './recorders/baseRecorder';
import CCaptureRecorder from './recorders/ccaptureRecorder';
import saveThumbnail from './recorders/thumbnailCapture';

//import ThreeRenderer from './renderers/threeRenderer';
import CanvasRenderer from './renderers/canvasRenderer';

interface CanvasElement extends HTMLCanvasElement {               
    captureStream(int): MediaStream;             
}

let formatSelect: HTMLSelectElement = document.getElementById('formatSelect') as HTMLSelectElement;
let recordBtn = document.getElementById('recordBtn');

class App {
    canvas: CanvasElement;
    renderer: CanvasRenderer;
    recorder: BaseRecorder;

    constructor() {
        this.canvas = <CanvasElement> document.getElementById('canvas');

        this.recorder = new CCaptureRecorder(this.canvas);
        this.renderer = new CanvasRenderer(this.canvas);
        this.animation();
        
        recordBtn.addEventListener('click', () => this.handleRecordBtnClick())
        formatSelect.addEventListener('change', () => this.handleFormatSelectChange())
    }

    handleRecordBtnClick() {
        if (formatSelect.value == 'thumbnail') {
            this.renderer.stop();
            saveThumbnail(this.canvas);
        } else {
            this.recorder.start();
            this.renderer.play();
            this.renderer.setCompleteCallback(() => this.handleComplete());
        }
    }

    handleFormatSelectChange() {
        if (formatSelect.value !== 'thumbnail') {
            this.recorder.setFormat(formatSelect.value);
        }
    }

    handleComplete() {
        this.recorder.stop();
        this.renderer.stop();
    }

    animation() {
        this.renderer.render();
        this.recorder.update();
        requestAnimationFrame(() => this.animation());
    }
    
}

new App();