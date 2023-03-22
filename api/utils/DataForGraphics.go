package utils

type PieGraphicItem struct {
	Name   string  `json:"name"`
	Color  string  `json:"color"`
	Amount float64 `json:"amount,string"`
}
