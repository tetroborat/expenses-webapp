package utils

func CheckDuplicateInStringArray(s []string, e string) bool {
	for _, a := range s {
		if a == e {
			return false
		}
	}
	return true
}
