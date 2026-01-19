export async function GET(request: Request) {
    //Fetch db data here
    const employees = [
        {id: 1, name: 'Jackson'},
        {id: 2, name: 'Mike'},
        {id: 3, name: 'Joan'},
    ];
    return new Response(JSON.stringify(employees), {
        status: 200,
        headers: {'Content-Type': 'application/json'}
    });
}