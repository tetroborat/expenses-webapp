import ExpenseTypesList from "../expenseType/ExpenseTypesList";
import WalletsList from "../wallet/WalletsList";
import {Component} from "react";

const marginScroll = 100
const clickDelay = '250'

export default class DraggableBoard extends Component {
    constructor(props) {
        super(props)
        this.WalletsRef = {}
        this.TypesRef = {}
        this.WalletWaitInit = false
    }

    render() {
        return (
            <>
                <WalletsList
                    wallets={this.props.wallets}
                    setElementRef={this.setWalletElementRef}
                    initDrag={this.initDrag}
                    addInfo={this.props.addInfo}
                    totalAmount={this.props.totalAmount.wallets}
                    symbol={this.props.symbol}
                    isLoadingWallets={this.props.isLoadingWallets}
                />
                <ExpenseTypesList
                    onClick={this.props.handleType}
                    expenseTypes={this.props.expenseTypes}
                    setElementRef={this.setTypeElementRef}
                    addInfo={this.props.addInfo}
                    totalAmount={this.props.totalAmount.types}
                    symbol={this.props.symbol}
                    isLoading={this.props.isLoadingExpenseTypes}
                />
            </>
        )
    }

    setWalletElementRef = (ref, model) => {
        this.WalletsRef[model.id] = {
            ref: ref,
            model: model
        }
    }

    setTypeElementRef = (ref, model) => {
        this.TypesRef[model.id] = {
            ref: ref,
            model: model
        }
    }

    initDrag = ({ pageX, pageY }, id) => {
        this.WalletWaitInit = true
        this.currentElement = this.WalletsRef[id]
        let currentElement = this.currentElement.ref
        let width = currentElement.childNodes[0].scrollWidth
        let { left, top, height } = currentElement.getBoundingClientRect();
        this.dragStartY = top + height / 2 + document.documentElement.scrollTop
        this.dragStartX = left + width / 2
        window.addEventListener('mouseup', this.stopDragging);
        setTimeout(() => {
            if (this.WalletWaitInit) {
                this.WalletWaitInit = false
                this.startDragging({ clientX: pageX, clientY: pageY })
                currentElement.getElementsByClassName('icon-item-image-block')[0].style.transition = '0s'
                window.addEventListener('mousemove', this.startDragging);
            }
        }, clickDelay)
    }

    startDragging = ({ pageX, pageY }) => {
        this.currentElement.ref.getElementsByClassName('icon-item-image-block')[0].style.transform =
            `translate(${pageX - this.dragStartX}px, ${pageY - this.dragStartY}px)`
        this.scrollElement({pageX, pageY})
    }

    stopDragging = ({ pageX, pageY }) => {
        if (this.WalletWaitInit) {
            this.WalletWaitInit = false
            this.props.handleWallet(this.currentElement.model)
        } else {
            this.currentElement.ref.getElementsByClassName('icon-item-image-block')[0].style.transform = 'unset'
            this.currentElement.ref.getElementsByClassName('icon-item-image-block')[0].style.transition = '.5s'
            this.checkDropOn(pageX, pageY)
        }
        window.removeEventListener('mousemove', this.startDragging)
        window.removeEventListener('mouseup', this.stopDragging)
    }

    scrollElement = ({pageX, pageY}) => {
        const scroll = document.documentElement.clientHeight + window.scrollY - pageY
        if (scroll < marginScroll) {
            window.scrollBy({
                top: marginScroll,
                behavior: 'smooth'
            });
        }
        if (pageY - window.scrollY < marginScroll) {
            window.scrollBy({
                top: -marginScroll,
                behavior: 'smooth'
            });
        }
    };

    checkDropOn(x, y) {
        function rule (element) {
            const {top, bottom, left, right} = element.getBoundingClientRect()
            return x > left && x < right && y > top && y < bottom
        }
        if (Object.keys(this.TypesRef).length > 0) {
            y -= document.documentElement.scrollTop
            for (const item of Object.values(this.TypesRef)) {
                const type = item.ref
                if (rule(type)) {
                    this.props.addInfo({
                        key: 'transaction',
                        info: {
                            wallet: this.currentElement.model,
                            type: item.model
                        }
                    })
                    break
                }
            }
        }
    }
}
