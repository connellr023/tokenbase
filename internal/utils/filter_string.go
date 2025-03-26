package utils

import "strings"

func FilterString(s string, f func(rune) bool) string {
	var b strings.Builder

	for _, r := range s {
		if f(r) {
			b.WriteRune(r)
		}
	}

	return b.String()
}
