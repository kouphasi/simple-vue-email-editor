export const wrapEmailHtml = (content: string, widthPx: number): string => {
  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Email</title>
  </head>
  <body style="margin:0;padding:0;background-color:#f5f5f7;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
      <tr>
        <td align="center" style="padding:24px 12px;">
          <table role="presentation" width="${widthPx}" cellspacing="0" cellpadding="0" style="border-collapse:collapse;width:${widthPx}px;max-width:${widthPx}px;background-color:#ffffff;">
            <tr>
              <td style="padding:24px;">
                ${content}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
};
