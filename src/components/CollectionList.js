import React from "react";
import {
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  Box,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const FIELD_LABELS = {
  vendorname: "Company",
  vendorcode: "Code",
  vendoraddress: "Address",
  vendorcity: "City",
  vendorstate: "State",
  vendorzipcode: "Zip",
  vendorphone: "Phone",

  reviewheadline: "Headline",
  reviewpageid: "Product",
  revieworderid: "Order #",
  reviewcreatedate: "Date",
  reviewid: "Review ID",
  reviewoverallrating: "Rating",
  reviewcomments: "Comment",
  reviewnickname: "Name",
  reviewlocation: "Location",

  total_reviews: "Total Reviews",
  average_rating: "Avg Rating",
  fivestar: "5 Star",
  fourstar: "4 Star",
  threestar: "3 Star",
  twostar: "2 Star",
  onestar: "1 Star",

  productcode: "Product Code",
  productid: "Product ID",
  shipzone1: "Zone 1",
  shipzone2: "Zone 2",
  shipzone3: "Zone 3",
  shipzone4: "Zone 4",
  shipzone5: "Zone 5",
  shipzone6: "Zone 6",
  shipzone7: "Zone 7",

  blogcategoryname: "Category",
  bloguri: "URI",
  blogcategoryid: "ID",
  blogmetadescription: "Meta",
  blogactive: "Active",

  postid: "Post ID",
  posttitle: "Title",
  posturi: "URI",
  postcontent: "Content",
  postsummary: "Summary",
  postthumbnail: "Thumb",
  postproductcode: "Product",
  postcategorycode: "Category",
  postdate: "Date",
  postiso8601: "ISO Date",

  newscategoryname: "Category",
  newsuri: "URI",
  newscategoryid: "ID",
  newsmetadescription: "Meta",
  newsactive: "Active",

  newsid: "News ID",
  newsindex: "Index",
  newscategoryid: "Category ID",
  newscontent: "Content",
  newsheading: "Heading",
  newssummary: "Summary",
  newsdate: "Date",
  newsphotourl: "Photo",
  newsphotothumb: "Thumb",

  reviewstatsid: "Stats ID",
  reviewscount: "Total Reviews",
  lastquerydate: "Last Query Date",
  lastupdated: "Last Updated",
  lastmerchantreviewid: "Last Merchant ID",
  total_reviews_formatted: "Total Reviews (Formatted)",
  total_google_eligible: "Google Eligible",
  average_rating: "Average Rating",
  fivestar: "5 Star",
  fourstar: "4 Star",
  threestar: "3 Star",
  twostar: "2 Star",
  onestar: "1 Star",
};

const formatValue = (value) => {
  if (value === null || value === undefined) return "—";
  if (typeof value === "number") return value.toLocaleString();
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return String(value);
};

const CollectionList = ({ folder, data, onEdit, onDelete }) => {
  if (!data || data.length === 0) return null;

  const item = data[0];
  const getTitle = () => {
    return (
      item[
        Object.keys(item).find(
          (k) =>
            k.includes("name") || k.includes("title") || k.includes("headline")
        )
      ] || `ID: ${item.key}`
    );
  };

  const fields = Object.keys(item).filter(
    (key) => key !== "key" && FIELD_LABELS[key]
  );

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "0.3s",
        "&:hover": { transform: "translateY(-4px)", boxShadow: 6 },
      }}
    >
      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        <Typography variant="h6" component="div" gutterBottom noWrap>
          {getTitle()}
        </Typography>
        <Box sx={{ mt: 1 }}>
          {fields.map((field) => (
            <Box
              key={field}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                py: 0.5,
                borderBottom: "1px solid #eee",
                "&:last-child": { borderBottom: "none" },
                gap: 1,
              }}
            >
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  fontWeight: 500,
                  flexShrink: 0,
                  minWidth: "120px",
                }}
              >
                {FIELD_LABELS[field] || field}:
              </Typography>

              {/* WRAP + TRUNCATE LONG TEXT */}
              <Typography
                variant="body2"
                color="text.primary"
                sx={{
                  flex: 1,
                  overflowWrap: "break-word",
                  wordBreak: "break-word",
                  hyphens: "auto",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "normal",
                  lineHeight: 1.4,
                }}
              >
                {formatValue(item[field])}
              </Typography>
            </Box>
          ))}
        </Box>
      </CardContent>

      <CardActions sx={{ justifyContent: "flex-end", pt: 0 }}>
        <Button
          size="small"
          startIcon={<EditIcon />}
          onClick={() => onEdit(item)}
          color="primary"
        >
          Edit
        </Button>
        <Button
          size="small"
          startIcon={<DeleteIcon />}
          onClick={() => onDelete(item.key)}
          color="error"
        >
          Delete
        </Button>
      </CardActions>
    </Card>
  );
};

export default CollectionList;
