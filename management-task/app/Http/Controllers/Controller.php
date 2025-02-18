<?php

namespace App\Http\Controllers;

abstract class Controller
{
    public function response($status,$message,$data = [], $error = []){
        $response = [
            "status" => $status,
            "message" => $message
        ];

        if (count($data) > 0) {
            $response['data'] = $data;
        }

        if (count($error) > 0) {
            $response['errors'] = $error;
        }

        return response()->json($response,$status);
    }
}
