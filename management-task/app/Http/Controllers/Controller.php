<?php

namespace App\Http\Controllers;

abstract class Controller
{
    public function response($code, $status, $message, $data = [], $error = [])
    {
        $response = [
            "status" => $status,
            "message" => $message
        ];

        if (!empty($data)) {
            $response['data'] = $data;
        }

        if (!empty($error)) {
            $response['errors'] = $error;
        }

        return response()->json($response, $code);
    }
}
