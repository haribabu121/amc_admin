export default function Invoice() {
  return (
    <div className="bg-gray-100 min-h-screen flex justify-center items-center p-6">
      <div className="bg-white w-[800px] p-8 shadow-lg border">

        {/* HEADER */}
        <div className="flex justify-between items-center border-b-2 border-teal-700 pb-2 mb-6">
          <h1 className="text-3xl font-bold text-teal-700">Invoice</h1>
        </div>

        {/* COMPANY + INVOICE INFO */}
        <div className="grid grid-cols-2 gap-6 mb-6 text-sm">
          <div>
            <p><strong>Company Name:</strong></p>
            <p className="border-b h-5"></p>

            <p className="mt-3"><strong>Address/City/ZIP Code:</strong></p>
            <p className="border-b h-5"></p>

            <p className="mt-3"><strong>Contact:</strong></p>
            <p className="border-b h-5"></p>
          </div>

          <div>
            <div className="flex justify-between">
              <p><strong>Date:</strong></p>
              <p className="border-b w-40"></p>
            </div>

            <div className="flex justify-between mt-3">
              <p><strong>Invoice No:</strong></p>
              <p className="border-b w-40"></p>
            </div>

            <div className="flex justify-between mt-6 items-center">
              <p className="text-teal-700 font-semibold">
                Invoice Total:
              </p>
              <div className="bg-teal-100 w-40 h-8"></div>
            </div>
          </div>
        </div>

        {/* RECEIVED TO */}
        <div className="mb-6 text-sm">
          <p className="text-teal-700 font-semibold mb-2">
            Amount Received To:
          </p>

          <p><strong>Name:</strong></p>
          <p className="border-b h-5 mb-2"></p>

          <p><strong>Address:</strong></p>
          <p className="border-b h-5 mb-2"></p>

          <p><strong>Contact:</strong></p>
          <p className="border-b h-5"></p>
        </div>

        {/* TABLE */}
        <table className="w-full border border-gray-300 text-sm mb-6">
          <thead>
            <tr className="bg-teal-700 text-white">
              <th className="border p-2 text-left">Description</th>
              <th className="border p-2 w-32">Unit Price</th>
              <th className="border p-2 w-32">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr className="h-48">
              <td className="border"></td>
              <td className="border"></td>
              <td className="border"></td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td
                colSpan="2"
                className="bg-teal-700 text-white text-right p-2 font-semibold"
              >
                Total Amount
              </td>
              <td className="bg-teal-100"></td>
            </tr>
          </tfoot>
        </table>

        {/* FOOTER
        <div className="grid grid-cols-5 gap-4 text-xs text-center mt-12">
          <div>
            <p className="border-t">Authorized Person</p>
          </div>
          <div>
            <p className="border-t">Title</p>
          </div>
          <div>
            <p className="border-t">Date</p>
          </div>
          <div>
            <p className="border-t">Contact</p>
          </div>
          <div>
            <p className="border-t">Authorized Signature</p>
          </div>
        </div> */}

      </div>
    </div>
  );
}
