import AddWallet from "../wallet/AddWallet";
import AddTransactionType from "../transactionType/AddTransactionType";
import AddTransaction from "../transaction/AddTransaction";
import {useState} from "react";
import ModalWindow from "../typicalElements/Modal";

export default function ActionBoard(props) {
    const [isDoubleLayer, setIsDoubleLayer] = useState(false);
    return (
        <ModalWindow
            body={renderSwitchAction(props, setIsDoubleLayer)}
            show={props.addInfo.show}
            cancelModal={props.cancelAddModal}
            className={isDoubleLayer ? "opacity-25" : ""}
        />
    )
}

function renderSwitchAction(props, setIsDoubleLayer) {
    switch(props.addInfo.key) {
        case 'wallet':
            return <AddWallet
                currencies={props.currencies}
                info={props.addInfo.info}
                updateData={model => {
                    props.updateData({loadWallets: true})
                    props.updateCurrentModel(model)
                }}
                addMessage={props.addMessage}
                setIsDoubleLayer={setIsDoubleLayer}
                backAction={props.backAction}
            />
        case 'replenishmentType':
            return <AddTransactionType
                add={true}
                info={props.addInfo.info}
                updateData={model => {
                    props.updateData({
                        loadReplenishmentTypes: true,
                        loadTransactions: true
                    })
                    props.updateCurrentModel(model)
                }}
                addMessage={props.addMessage}
                setIsDoubleLayer={setIsDoubleLayer}
                backAction={props.backAction}
            />
        case 'expenseType':
            return <AddTransactionType
                info={props.addInfo.info}
                updateData={model => {
                    props.updateData({
                        loadExpenseTypes: true,
                        loadTransactions: true
                    })
                    props.updateCurrentModel(model)
                }}
                addMessage={props.addMessage}
                setIsDoubleLayer={setIsDoubleLayer}
                backAction={props.backAction}
            />
        case 'transaction':
            return <AddTransaction
                wallets={props.wallets}
                replenishmentTypes={props.replenishmentTypes}
                expenseTypes={props.expenseTypes}
                allExpenseTypes={props.allExpenseTypes}
                currencies={props.currencies}
                updateData={() => props.updateData({
                    loadTransactions: true,
                    loadWallets: true,
                    loadExpenseTypes: true,
                    loadReplenishmentTypes: true
                })}
                info={props.addInfo.info}
                addMessage={props.addMessage}
                symbol={props.symbol}
                setIsDoubleLayer={setIsDoubleLayer}
                backAction={props.backAction}
            />
        default:
            return
    }
}