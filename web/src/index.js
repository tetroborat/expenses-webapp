import React from 'react'
import ReactDOM from 'react-dom/client'
import './styles/index.css'
import './styles/background.css'
import './styles/infographic.css'
import './styles/placeholder.css'
import "bootstrap-icons/font/bootstrap-icons.css"
import importImages from "./utils/ImportImages"
import BackgroundIcons from "./components/BackgroundIcons"
import StartBoard from "./components/board/StartBoard"

const DOMAIN = window.location.hostname
export const DOMAIN_API=`http://${DOMAIN}:3000`
export const DOMAIN_WEB=`http://${DOMAIN}:${window.location.port}`

export let WalletImages = importImages(require.context('./images/wallets', false, /\.(svg)$/))
export let ExpensesTypeImages = importImages(require.context('./images/transactionsTypes/expensesTypeImages', false, /\.(svg)$/))
export let ReplenishmentTypeImages = importImages(require.context('./images/transactionsTypes/replenishmentTypeImages', false, /\.(svg)$/))
export let AllIcons = [
    ...WalletImages.urls,
    ...ReplenishmentTypeImages.urls,
    ...ExpensesTypeImages.urls
]

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
    <>
        <StartBoard/>
        <BackgroundIcons/>
    </>
)