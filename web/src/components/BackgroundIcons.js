import Svg from "./typicalElements/Svg";
import {AllIcons} from "../index";

export default function BackgroundIcons() {
    return (
        <div className="circles">
            <style>
                {
                    AllIcons.map((_, index) => {
                            let size = Math.floor(Math.random() * 150)
                            return `.circles li:nth-child(${index}){
                                left: ${Math.floor(index / AllIcons.length * 100)}%;
                                width: ${size}px;
                                height: ${size}px;
                                animation-delay: ${Math.floor(Math.random() * 15)}s;
                                animation-duration: ${15 + Math.floor(Math.random() * 30)}s;
                            }`
                        }
                    )
                }
            </style>
            {
                AllIcons.map(url => <li><Svg url={url}/></li>)
            }
        </div>
    )
}