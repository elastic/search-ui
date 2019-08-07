ALTER PROCEDURE stg.spInnovGetIOs AS
    SELECT
        c.Id                    campaignid,
        v.PrimaryName           vendor,
        v.SecondaryName         altendor,
        cv.VendorRefNr          vendorref,
        i.InsertionOrderCode    ionumber,
        i.InsertionOrderName   ioref
    FROM apac.CampaignVendor cv
    JOIN apac.Vendor v ON (cv.VendorId = v.OrganisationId)
    LEFT JOIN apac.InsertionOrder i ON (cv.CampaignId = i.CampaignId AND cv.VendorId = i.VendorId)
    JOIN apac.Campaign c ON (cv.CampaignId = c.Id)
    JOIN apac.CampaignCountryBudget ccb ON (c.Id = ccb.CampaignId AND ccb.CountryCode = 'AUS')
    WHERE c.StartDate > '2019-01-01'
    AND i.Active = 1
    ORDER BY c.Id DESC;