package main

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestStatusHandler(t *testing.T) {
	req, err := http.NewRequest("GET", "/status", nil)
	if err != nil {
		t.Fatal(err)
	}

	rr := httptest.NewRecorder()
	handler := http.HandlerFunc(statusHandler)

	handler.ServeHTTP(rr, req)

	if status := rr.Code; status != http.StatusOK {
		t.Errorf("handler returned wrong status code: got %v want %v",
			status, http.StatusOK)
	}

	var data map[string]string
	err = json.NewDecoder(rr.Body).Decode(&data)
	if err != nil {
		t.Fatal(err)
	}

	if data["Status"] != "OK" {
		t.Errorf("handler returned unexpected body: got %v want %v",
			data["Status"], "OK")
	}
}

func TestWeatherHandler(t *testing.T) {
	req, err := http.NewRequest("GET", "/weather", nil)
	if err != nil {
		t.Fatal(err)
	}

	rr := httptest.NewRecorder()
	handler := http.HandlerFunc(weatherHandler)

	handler.ServeHTTP(rr, req)

	if status := rr.Code; status != http.StatusOK {
		t.Errorf("handler returned wrong status code: got %v want %v",
			status, http.StatusOK)
	}

	var data map[string]interface{}
	err = json.NewDecoder(rr.Body).Decode(&data)
	if err != nil {
		t.Fatal(err)
	}

	if _, ok := data["weather"]; !ok {
		t.Errorf("handler returned unexpected body: missing weather key")
	}
}
