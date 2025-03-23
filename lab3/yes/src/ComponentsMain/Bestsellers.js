import React, { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Container,
  Typography,
  Grid,
  Box,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  CircularProgress,
  IconButton,
  useTheme,
  useMediaQuery,
  Breadcrumbs,
  Link,
  Chip,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import VisibilityIcon from "@mui/icons-material/Visibility";
import HomeIcon from "@mui/icons-material/Home";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import StarIcon from "@mui/icons-material/Star";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";

const StyledCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: theme.shadows[8],
  },
}));

const StyledCardMedia = styled(CardMedia)({
  paddingTop: "100%",
  position: "relative",
  "&:hover": {
    "& .MuiCardMedia-overlay": {
      opacity: 1,
    },
  },
});

const MediaOverlay = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  backgroundColor: "rgba(0, 0, 0, 0.4)",
  opacity: 0,
  transition: "opacity 0.3s ease-in-out",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const BestsellerBadge = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: 16,
  right: 16,
  backgroundColor: theme.palette.error.main,
  color: "white",
  padding: "4px 8px",
  borderRadius: "16px",
  display: "flex",
  alignItems: "center",
  gap: "4px",
  zIndex: 1,
}));

const Bestsellers = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    // Симулируем загрузку данных
    const dummyData = [
      {
        id: 1,
        name: "Ray-Ban Aviator",
        price: "$199.99",
        rating: 4.9,
        sales: 1250,
        image: "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        description: "Iconic aviator sunglasses with polarized lenses",
        category: "Bestseller",
      },
      {
        id: 2,
        name: "Oakley Holbrook",
        price: "$179.99",
        rating: 4.8,
        sales: 980,
        image: "https://images.unsplash.com/photo-1508296695146-257a814070b4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        description: "Sports-inspired design with premium materials",
        category: "Bestseller",
      },
      {
        id: 3,
        name: "Persol Classic",
        price: "$249.99",
        rating: 4.7,
        sales: 850,
        image: "https://images.unsplash.com/photo-1582142306909-195724d33ffc?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        description: "Timeless Italian craftsmanship",
        category: "Bestseller",
      },
      {
        id: 4,
        name: "Gucci Square",
        price: "$329.99",
        rating: 4.6,
        sales: 720,
        image: "https://images.unsplash.com/photo-1577744486770-020ab432da65?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        description: "Luxury square frames with signature details",
        category: "Bestseller",
      },
    ];

    setTimeout(() => {
      setItems(dummyData);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box sx={{ mb: 6 }}>
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb"
          sx={{ mb: 4 }}
        >
          <Link
            underline="hover"
            color="inherit"
            component={RouterLink}
            to="/"
            sx={{ display: "flex", alignItems: "center" }}
          >
            <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            Home
          </Link>
          <Typography color="text.primary">Bestsellers</Typography>
        </Breadcrumbs>

        <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 2 }}>
          Our Bestsellers
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ mb: 4, maxWidth: 800 }}
        >
          Discover our most popular eyewear selections. These pieces have earned
          their status through exceptional quality, style, and customer satisfaction.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {items.map((item) => (
          <Grid item key={item.id} xs={12} sm={6} md={4} lg={3}>
            <StyledCard>
              <Box sx={{ position: "relative" }}>
                <BestsellerBadge>
                  <LocalFireDepartmentIcon fontSize="small" />
                  <Typography variant="caption">
                    {item.sales}+ sold
                  </Typography>
                </BestsellerBadge>
                <StyledCardMedia
                  image={item.image}
                  title={item.name}
                >
                  <MediaOverlay className="MuiCardMedia-overlay">
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<VisibilityIcon />}
                      component={RouterLink}
                      to={`/bestseller/${item.id}`}
                      sx={{
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                        color: "text.primary",
                        "&:hover": {
                          backgroundColor: "white",
                        },
                      }}
                    >
                      Quick View
                    </Button>
                  </MediaOverlay>
                </StyledCardMedia>
              </Box>

              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ mb: 1 }}>
                  <Chip
                    label={item.category}
                    size="small"
                    color="error"
                    sx={{ backgroundColor: "rgba(211, 47, 47, 0.1)" }}
                  />
                </Box>
                <Typography variant="h6" component="h2" sx={{ mb: 1 }}>
                  {item.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {item.description}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography variant="h6" color="primary">
                    {item.price}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <StarIcon sx={{ color: "gold", mr: 0.5 }} />
                    <Typography variant="body2">{item.rating}</Typography>
                  </Box>
                </Box>
              </CardContent>

              <CardActions sx={{ p: 2, pt: 0 }}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<ShoppingBagIcon />}
                  sx={{
                    borderRadius: "25px",
                    textTransform: "none",
                    transition: "all 0.3s ease-in-out",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: 3,
                    },
                  }}
                >
                  Add to Cart
                </Button>
              </CardActions>
            </StyledCard>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Bestsellers;
