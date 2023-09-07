import TransactionTypesList from "../transactionType/TransactionTypesList";
import WalletsList from "../wallet/WalletsList";
import {Component} from "react";

const marginScroll = 100
const clickDelay = '250'

export default class DraggableBoard extends Component {
    constructor(props) {
        super(props)
        this.WalletsRef = {}
        this.ReplenishmentTypesRef = {}
        this.ExpenseTypesRef = {}
        this.WaitInit = false
    }

    render() {
        return (
            <>
                <TransactionTypesList
                    add={true}
                    initDrag={this.initDrag}
                    transactionTypes={this.props.replenishmentTypes}
                    setElementRef={this.setReplenishmentTypeElementRef}
                    addInfo={this.props.addInfo}
                    totalAmount={this.props.totalAmount.replenishmentTypes}
                    symbol={this.props.symbol}
                    isLoading={this.props.isLoadingReplenishmentTypes}
                />
                <WalletsList
                    wallets={this.props.wallets}
                    setElementRef={this.setWalletElementRef}
                    initDrag={this.initDrag}
                    addInfo={this.props.addInfo}
                    totalAmount={this.props.totalAmount.wallets}
                    symbol={this.props.symbol}
                    isLoading={this.props.isLoadingWallets}
                />
                <TransactionTypesList
                    onClick={this.props.handleType}
                    transactionTypes={this.props.expenseTypes}
                    setElementRef={this.setExpenseTypeElementRef}
                    addInfo={this.props.addInfo}
                    totalAmount={this.props.totalAmount.expenseTypes}
                    symbol={this.props.symbol}
                    isLoading={this.props.isLoadingExpenseTypes}
                />
            </>
        )
    }

    setReplenishmentTypeElementRef = (ref, model) => {
        this.ReplenishmentTypesRef[model.id] = {
            ref: ref,
            model: model
        }
    }

    setWalletElementRef = (ref, model) => {
        this.WalletsRef[model.id] = {
            ref: ref,
            model: model
        }
    }

    setExpenseTypeElementRef = (ref, model) => {
        this.ExpenseTypesRef[model.id] = {
            ref: ref,
            model: model
        }
    }

    initDrag = ({ pageX, pageY }, id) => {
        if (id in this.WalletsRef) {
            this.currentElement = this.WalletsRef[id]
            this.draggingWallet = true
        } else {
            this.currentElement = this.ReplenishmentTypesRef[id]
            this.draggingWallet = false
        }
        this.WaitInit = true
        let currentElement = this.currentElement.ref
        this.currentImage = currentElement.getElementsByClassName('icon-item-image-block')[0]
        let width = currentElement.childNodes[0].scrollWidth
        let { left, top, height } = currentElement.getBoundingClientRect();
        this.dragStartY = top + height / 2 + document.documentElement.scrollTop
        this.dragStartX = left + width / 2
        window.addEventListener('mouseup', this.stopDragging);
        setTimeout(() => {
            if (this.WaitInit) {
                this.WaitInit = false
                this.startDragging({ clientX: pageX, clientY: pageY })
                this.currentImage.style.transition = '0s'
                window.addEventListener('mousemove', this.startDragging);
            }
        }, clickDelay)
    }

    startDragging = ({ pageX, pageY }) => {
        this.currentImage.style.transform =
            `translate(${pageX - this.dragStartX}px, ${pageY - this.dragStartY}px)`
        this.currentImage.style.zIndex = '500'
        this.scrollElement({pageX, pageY})
    }

    stopDragging = ({ pageX, pageY }) => {
        if (this.WaitInit) {
            this.WaitInit = false
            if (this.draggingWallet) {
                this.props.handleWallet(this.currentElement.model)
            } else {            
                this.props.handleType(this.currentElement.model)
            }
        } else {
            this.currentImage.style.transform = 'unset'
            this.currentImage.style.transition = '.5s'
            this.currentImage.style.zIndex = '200'
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
        var checkList
        if (this.draggingWallet) {
            checkList = this.ExpenseTypesRef
        } else {
            checkList = this.WalletsRef
        }
        if (Object.keys(checkList).length > 0) {
            y -= document.documentElement.scrollTop
            for (const item of Object.values(checkList)) {
                const type = item.ref
                if (rule(type)) {
                    this.props.addInfo({
                        key: 'transaction',
                        info: this.draggingWallet ? {
                            wallet: this.currentElement.model,
                            type: item.model
                        } : {
                            type: this.currentElement.model,
                            wallet: item.model
                        }
                    })
                    break
                }
            }
        }
    }
}
