import {Component} from "react";
import TransactionsList from "../transaction/TransactionsList";
import load from "../../utils/FetchLoad";
import DraggableBoard from "../board/DraggableBoard";
import ActionBoard from "../board/ActionBoard";
import {Col, Image, Row, Spinner} from "react-bootstrap";
import WalletInfo from "../wallet/WalletInfo";
import ExpenseTypeInfo from "../expenseType/ExpenseTypeInfo";
import LogoutButton from "../auth/LogoutButton";
import GetTransactionsPath from "../../utils/GetTransactionsPath";
import GetIntervalPath from "../../utils/GetIntervalPath";

export default class MainPage extends Component {
    constructor(props) {
        super(props);
        let today = new Date()
        this.state = {
            isLoadingWallets: true,
            isLoadingExpenseTypes: true,
            isLoadingTransactions: true,
            hasTransactions: false,
            transactionsPath: {},
            wallets: [],
            transactions: [],
            replenishmentTypes: [],
            expenseTypes: [],
            allExpenseTypes: [],
            currencies: [],
            totalReplenishmentTypes: 0,
            totalExpenseTypesAmount: 0,
            totalWalletsAmount: 0,
            totalTransactionsAmount: 0,
            addInfo: {
                show: false,
                key: null,
                info: {
                    wallet: null,
                    type: null,
                    transaction: null
                }
            },
            currentModel: null,
            totalTransactionsSymbol: props.userInfo.currency.symbol,
            timeInterval: {
                fromDate: new Date(today.getFullYear(), today.getMonth(), 1).toISOString(),
                toDate: new Date(today.setUTCHours(23,59,59,999)).toISOString(),
            }
        }
    }

    render() {
        return (
            <>
                <div className="head-logo position-relative d-flex justify-content-center align-items-center text-white">
                    <Image draggable="false" width={300} src="logo-md.svg" alt="Expanses"/>
                    <h4 className="position-absolute action-btn-group mt-4">
                        <span className="action-btn me-1">
                            <i className="bi bi-person-gear"></i>
                        </span>
                        <LogoutButton
                            onClick={this.props.logout}
                        />
                    </h4>
                </div>
                <Row>
                    <Col>
                        {this.renderLeftSide()}
                    </Col>
                    <Col>
                        {this.renderRightSide()}
                    </Col>
                </Row>
            </>
        )
    }

    renderLeftSide() {
        return (
            <>
                {
                    !!Object.keys(this.state.transactionsPath).length ?
                        <>
                            {this.renderInfo()}
                        </>
                        :
                        <DraggableBoard
                            addInfo={({key, info}) => this.addInfo({
                                key: key,
                                info: info
                            })}
                            handleWallet={model => {
                                this.handleIconItem(model, {walletId: model.id})
                                this.setState({
                                    totalTransactionsSymbol: model.symbol
                                })
                            }}
                            wallets={this.state.wallets}
                            handleType={model => {
                                this.handleIconItem(model, {typeId: model.id})
                            }}
                            expenseTypes={this.state.expenseTypes}
                            totalAmount={{
                                types: this.state.totalExpenseTypesAmount,
                                wallets: this.state.totalWalletsAmount,
                            }}
                            symbol={this.props.userInfo.currency.symbol}
                            isLoadingWallets={this.state.isLoadingWallets}
                            isLoadingExpenseTypes={this.state.isLoadingExpenseTypes}
                        />
                }
                {
                    this.state.currencies.length > 0 ?
                        <ActionBoard
                            cancelAddModal={() => this.cancelAddModal()}
                            updateData={kwargs => this.updateData(kwargs)}
                            addInfo={this.state.addInfo}
                            wallets={this.state.wallets}
                            expenseTypes={this.state.expenseTypes}
                            allExpenseTypes={this.state.allExpenseTypes}
                            addMessage={message => this.props.addMessage(message)}
                            currencies={this.state.currencies}
                            updateCurrentModel={model => this.setState({
                                currentModel: model
                            })}
                            symbol={this.props.userInfo.currency.symbol}
                            backAction={() => this.setState({
                                transactionsPath: {},
                                totalTransactionsSymbol: this.props.userInfo.currency.symbol
                            })}
                        /> :
                        <Spinner size="lg"/>
                }
            </>
        )
    }

    renderRightSide() {
        return (
            <TransactionsList
                transactions={this.state.transactions}
                addInfo={info => this.addInfo({
                    key: 'transaction',
                    info: info
                })}
                timeInterval={this.state.timeInterval}
                selectDate={({fromDate, toDate}) => {
                    this.setState({
                        timeInterval: {
                            fromDate: fromDate,
                            toDate: toDate,
                        }
                    }, () => this.updateData({
                        loadTransactions: true,
                        loadExpenseTypes: true,
                        loadReplenishmentTypes: true
                    }))
                }}
            />
        )
    }

    renderInfo() {
        return (
            "walletId" in this.state.transactionsPath ?
                <WalletInfo
                    addInfo={wallet => this.addInfo({
                        key: 'wallet',
                        info: {
                            wallet: wallet,
                        }
                    })}
                    wallet={this.state.currentModel}
                    addMessage={message => this.props.addMessage(message)}
                    backAction={() => {this.setState({
                        transactionsPath: {},
                        totalTransactionsSymbol: this.props.userInfo.currency.symbol
                    },() => this.loadTransactions({}))}}
                    updateData={withOperation => this.updateData({
                        loadWallets: true,
                        loadExpenseTypes: withOperation
                    })}
                    timeInterval={this.state.timeInterval}
                    totalExpenseTypesAmount={this.state.totalExpenseTypesAmount}
                /> :
                "typeId" in this.state.transactionsPath ?
                    <ExpenseTypeInfo
                        addInfo={expenseType => this.addInfo({
                            key: 'type',
                            info: {
                                type: expenseType,
                            }
                        })}
                        expenseType={this.state.currentModel}
                        mainCurrencySymbol={this.props.userInfo.currency.symbol}
                        addMessage={message => this.props.addMessage(message)}
                        backAction={() => {this.setState({
                            transactionsPath: {}
                        },() => this.loadTransactions({}))}}
                        updateData={withOperation => this.updateData({
                            loadExpenseTypes: true,
                            loadWallets: withOperation,
                        })}
                        timeInterval={this.state.timeInterval}
                    /> :
                    ''
        )
    }

    handleIconItem(model, transactionsPath) {
        this.setState({
            hasTransactions: true,
            transactionsPath: transactionsPath,
            currentModel: model
        });
        this.loadTransactions(transactionsPath)
    }

    addInfo({key, info = null}) {
        this.setState({
            addInfo: {
                show: true,
                key: key,
                info: info
            }
        })
    }

    cancelAddModal() {
        this.setState({
            addInfo: {
                show: false,
                key: null,
                info: {
                    wallet: null,
                    type: null
                }
            }
        })
    }

    loadWallets() {
        this.setState({
            isLoadingWallets: true
        }, () => load({
            path: "/wallet/list"
        }).then(data => {
            this.setState({
                wallets: data.list,
                totalWalletsAmount: data.total.toFixed(2)},
                () => this.setState({isLoadingWallets: false}))
            })
        )
    }

    async componentDidMount() {
        await this.loadCurrencies()
        await this.updateData({
            loadWallets: true,
            loadReplenishmentTypes: true,
            loadExpenseTypes: true,
            loadTransactions: true,
        })
    }

    loadTransactions({walletId = null, typeId = null}) {
        load({
            path: GetTransactionsPath({walletId, typeId}) + this.getIntervalPath(),
        }).then(data => {
            if (data.total !== 0) {
                this.setState({
                    transactions: data.list,
                    totalTransactionsAmount: data.total.toFixed(2)
                })
            } else {
                this.setState({
                    transactions: [],
                    totalTransactionsAmount: 0
                })
            }
        })
    }

    loadReplenishmentTypes() {
        load({
            path: "/transaction-type/replenishment-list" + this.getIntervalPath()
        }).then(data => {
            this.setState({
                replenishmentTypes: data.list,
                totalReplenishmentTypes: data.total.toFixed(2)
            })
        })
    }

    loadExpenseTypes() {
        this.setState({
            isLoadingExpenseTypes: true
        }, () => load({
            path: "/transaction-type/expense-list" + this.getIntervalPath()
        }).then(data => {
            this.setState({
                expenseTypes: data.list,
                allExpenseTypes: data.list_with_delete,
                totalExpenseTypesAmount: data.total.toFixed(2)
            },
                () => this.setState({isLoadingExpenseTypes: false}))
        }))
    }

    loadCurrencies() {
        load({path: "/currencies"}).then(data => {
            this.setState({
                currencies: data
            })
        })
    }

    async updateData({
                         loadWallets = false,
                         loadReplenishmentTypes = false,
                         loadExpenseTypes = false,
                         loadTransactions = false
                     } = {}) {
        if (loadWallets) {
            await this.loadWallets()
        }
        if (loadReplenishmentTypes) {
            await this.loadReplenishmentTypes()
        }
        if (loadExpenseTypes) {
            await this.loadExpenseTypes()
        }
        if (loadTransactions) {
            await this.loadTransactions(this.state.transactionsPath)
        }
        this.cancelAddModal()
    }

    getIntervalPath() {
        return GetIntervalPath(this.state.timeInterval)
    }
}