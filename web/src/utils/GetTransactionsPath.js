
export default function GetTransactionsPath({walletId = null, typeId = null}) {
    return (walletId ?
        '/transaction/list-from-wallet/' + walletId :
        typeId ?
            '/transaction/list-from-expense-type/' + typeId :
            '/transaction/list')
}