package main

import (
	"encoding/json"
	"net/http"
	"sync"
	"time"
)

var weatherData struct {
	sync.RWMutex
	data    map[string]interface{}
	expires time.Time
}

func weatherHandler(w http.ResponseWriter, r *http.Request) {
	weatherData.RLock()
	defer weatherData.RUnlock()
	// check if the data is still valid
	if time.Now().Before(weatherData.expires) {
		// return the cached data
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(weatherData.data)
		return
	}
	// construct the API URL
	url := "https://api.openweathermap.org/data/2.5/weather?q=Jakarta&appid=c7c94c8e7932d656009f92c8263cdf5b&units=metric"
	// make a GET request to the API
	resp, err := http.Get(url)
	if err != nil {
		http.Error(w, "Failed to fetch weather data", http.StatusInternalServerError)
		return
	}
	defer resp.Body.Close()
	// decode the JSON response
	err = json.NewDecoder(resp.Body).Decode(&weatherData.data)
	if err != nil {
		http.Error(w, "Failed to parse weather data", http.StatusInternalServerError)
		return
	}
	// cache the data for 15 minutes
	weatherData.expires = time.Now().Add(15 * time.Minute)
	// return the JSON data as the response
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(weatherData.data)
}

func statusHandler(w http.ResponseWriter, r *http.Request) {
	data := map[string]string{
		"Status": "OK",
	}

	err := json.NewEncoder(w).Encode(data)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}

func main() {
	println("listening on :8000")
	http.HandleFunc("/weather", weatherHandler)
	http.HandleFunc("/status", statusHandler)
	http.ListenAndServe(":8000", nil)
}
