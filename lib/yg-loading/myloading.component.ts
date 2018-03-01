import { Component,Input, Output,forwardRef,OnInit,ElementRef,EventEmitter} from '@angular/core';
@Component({
     selector: 'my-loading',
     template: `
         <div class="htmleaf-container">
            <div class="container">
            <section>
                <div class="loader loader-7">
                <div class="line line1"></div>
                <div class="line line2"></div>
                <div class="line line3"></div>
                </div>
            </section>
            </div>
	    </div>
        `,
    styles: [
        `
        .htmleaf-container{position: absolute;top: 32%;left: 50%;}
        .loader { position: relative; width: 60px; height: 60px; border-radius: 50%; margin: 75px; display: inline-block; vertical-align: middle; }
        .loader-7 .line { width: 8px; position: absolute; border-radius: 5px; bottom: 0; background: -webkit-gradient(linear, left top, left bottom, from(#1ee95d), to(#5714ce)); background: -webkit-linear-gradient(top, #1ee95d, #5714ce); background: linear-gradient(to bottom, #1ee95d, #5714ce); }
        .loader-7 .line1 { left: 0; -webkit-animation: line-grow 0.5s ease alternate infinite; animation: line-grow 0.5s ease alternate infinite; }
        .loader-7 .line2 { left: 20px; -webkit-animation: line-grow 0.5s 0.2s ease alternate infinite; animation: line-grow 0.5s 0.2s ease alternate infinite; }
        .loader-7 .line3 { left: 40px; -webkit-animation: line-grow 0.5s 0.4s ease alternate infinite; animation: line-grow 0.5s 0.4s ease alternate infinite; }   
        @-webkit-keyframes line-grow {
        0% {
          height: 0;
        }
        100% {
           height: 75%;
        }
        }
        @keyframes line-grow {
        0% {
           height: 0;
        }
        100% {
           height: 75%;
          }
        }         
        `
    ]
})
export class MyLoadingComponent implements OnInit{

	ngOnInit() {
	}

}