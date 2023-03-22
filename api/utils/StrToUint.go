package utils

import (
	"strconv"
)

func StrToUint(str string) uint {
	u64, _ := strconv.ParseUint(str, 10, 32)
	wd := uint(u64)
	return wd
}
